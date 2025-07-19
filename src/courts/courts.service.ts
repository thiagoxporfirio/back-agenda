import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../entities/court.entity';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
  ) {}

  async create(createCourtDto: CreateCourtDto): Promise<Court> {
    const court = this.courtRepository.create(createCourtDto);
    return await this.courtRepository.save(court);
  }

  async findAll(): Promise<Court[]> {
    return await this.courtRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Court> {
    const court = await this.courtRepository.findOne({
      where: { id },
    });

    if (!court) {
      throw new NotFoundException(`Quadra com ID ${id} não encontrada`);
    }

    return court;
  }

  async update(id: number, updateCourtDto: UpdateCourtDto): Promise<Court> {
    const court = await this.findOne(id);

    Object.assign(court, updateCourtDto);

    return await this.courtRepository.save(court);
  }

  async remove(id: number): Promise<void> {
    const court = await this.findOne(id);
    await this.courtRepository.remove(court);
  }
}
