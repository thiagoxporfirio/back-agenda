import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<Booking> {
    const {
      courtId,
      startTime,
      duration,
      status = 'pending',
      notes,
    } = createBookingDto;

    // Verificar se a quadra existe
    const court = await this.courtRepository.findOne({
      where: { id: courtId },
    });
    if (!court) {
      throw new NotFoundException(`Quadra com ID ${courtId} não encontrada`);
    }

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

    // Validar se a data não é no passado
    if (startDate < new Date()) {
      throw new BadRequestException(
        'Não é possível criar reserva para data/hora no passado',
      );
    }

    // Verificar conflitos de horário
    await this.checkTimeConflicts(courtId, startDate, endDate);

    const booking = this.bookingRepository.create({
      userId,
      courtId,
      startTime: startDate,
      endTime: endDate,
      duration,
      status,
      notes,
    });

    return await this.bookingRepository.save(booking);
  }

  async findByDate(date: string): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.bookingRepository.find({
      where: {
        startTime: Between(startOfDay, endOfDay),
      },
      relations: ['court', 'user'],
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['court', 'user'],
      order: {
        startTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['court', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }

    return booking;
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    userId: number,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    // Verificar se o usuário é o dono da reserva (ou admin)
    if (booking.userId !== userId) {
      throw new BadRequestException(
        'Você só pode atualizar suas próprias reservas',
      );
    }

    const { startTime, duration, courtId } = updateBookingDto;

    // Se está alterando horário ou duração, verificar conflitos
    if (startTime || duration) {
      const newStartTime = startTime ? new Date(startTime) : booking.startTime;
      const newDuration = duration || booking.duration;
      const newEndTime = new Date(
        newStartTime.getTime() + newDuration * 60 * 60 * 1000,
      );
      const newCourtId = courtId || booking.courtId;

      // Validar se a nova data não é no passado
      if (newStartTime < new Date()) {
        throw new BadRequestException(
          'Não é possível alterar reserva para data/hora no passado',
        );
      }

      // Verificar conflitos (excluindo a própria reserva)
      await this.checkTimeConflicts(newCourtId, newStartTime, newEndTime, id);

      Object.assign(booking, {
        ...updateBookingDto,
        startTime: newStartTime,
        endTime: newEndTime,
      });
    } else {
      Object.assign(booking, updateBookingDto);
    }

    return await this.bookingRepository.save(booking);
  }

  async remove(id: number, userId: number): Promise<void> {
    const booking = await this.findOne(id);

    // Verificar se o usuário é o dono da reserva (ou admin)
    if (booking.userId !== userId) {
      throw new BadRequestException(
        'Você só pode remover suas próprias reservas',
      );
    }

    await this.bookingRepository.remove(booking);
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { userId },
      relations: ['court'],
      order: {
        startTime: 'DESC',
      },
    });
  }

  private async checkTimeConflicts(
    courtId: number,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: number,
  ): Promise<void> {
    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.courtId = :courtId', { courtId })
      .andWhere('booking.status != :cancelledStatus', {
        cancelledStatus: 'cancelled',
      })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeBookingId) {
      conflictingBookings.andWhere('booking.id != :excludeBookingId', {
        excludeBookingId,
      });
    }

    const conflicts = await conflictingBookings.getMany();

    if (conflicts.length > 0) {
      throw new ConflictException(
        'Já existe uma reserva para esta quadra no horário solicitado',
      );
    }
  }
}
