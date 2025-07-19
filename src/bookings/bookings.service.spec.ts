import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBooking: Booking = {
    id: 1,
    userId: 1,
    courtId: 1,
    startTime: new Date('2024-07-20T10:00:00Z'),
    endTime: new Date('2024-07-20T11:00:00Z'),
    duration: 1.0,
    status: 'pending',
    notes: 'Test booking',
    createdAt: new Date(),
    updatedAt: new Date(),
    court: {
      id: 1,
      name: 'Quadra 1',
      description: 'Test court',
      createdAt: new Date(),
      updatedAt: new Date(),
      bookings: [],
    },
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
      password: 'password',
      role: 'user',
    },
  };

  const mockCourt: Court = {
    id: 1,
    name: 'Quadra 1',
    description: 'Test court',
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockCourtRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Court),
          useValue: mockCourtRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 24); // 24 horas no futuro

    const createBookingDto: CreateBookingDto = {
      courtId: 1,
      startTime: futureDate.toISOString(),
      duration: 1.0,
    };

    it('should create a new booking successfully', async () => {
      mockCourtRepository.findOne.mockResolvedValue(mockCourt);
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.create(createBookingDto, 1);

      expect(mockCourtRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockBookingRepository.create).toHaveBeenCalled();
      expect(mockBookingRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException when court does not exist', async () => {
      mockCourtRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCourtRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when trying to book in the past', async () => {
      const pastBookingDto = {
        ...createBookingDto,
        startTime: '2020-01-01T10:00:00Z',
      };

      mockCourtRepository.findOne.mockResolvedValue(mockCourt);

      await expect(service.create(pastBookingDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when there is a time conflict', async () => {
      mockCourtRepository.findOne.mockResolvedValue(mockCourt);
      mockQueryBuilder.getMany.mockResolvedValue([mockBooking]);

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByDate', () => {
    it('should return bookings for specific date', async () => {
      const bookings = [mockBooking];
      mockBookingRepository.find.mockResolvedValue(bookings);

      const result = await service.findByDate('2024-07-20');

      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: {
          startTime: expect.any(Object),
        },
        relations: ['court', 'user'],
        order: {
          startTime: 'ASC',
        },
      });
      expect(result).toEqual(bookings);
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const bookings = [mockBooking];
      mockBookingRepository.find.mockResolvedValue(bookings);

      const result = await service.findAll();

      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        relations: ['court', 'user'],
        order: {
          startTime: 'DESC',
        },
      });
      expect(result).toEqual(bookings);
    });
  });

  describe('findOne', () => {
    it('should return a booking when found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne(1);

      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['court', 'user'],
      });
      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException when booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateBookingDto: UpdateBookingDto = {
      notes: 'Updated notes',
    };

    it('should update a booking successfully', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue({
        ...mockBooking,
        ...updateBookingDto,
      });

      const result = await service.update(1, updateBookingDto, 1);

      expect(mockBookingRepository.save).toHaveBeenCalled();
      expect(result.notes).toBe('Updated notes');
    });

    it('should throw BadRequestException when user is not the owner', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.update(1, updateBookingDto, 2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should check conflicts when updating time', async () => {
      const futureUpdateDate = new Date();
      futureUpdateDate.setHours(futureUpdateDate.getHours() + 48); // 48 horas no futuro

      const timeUpdateDto: UpdateBookingDto = {
        startTime: futureUpdateDate.toISOString(),
        duration: 1.5,
      };

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockBookingRepository.save.mockResolvedValue({
        ...mockBooking,
        ...timeUpdateDto,
      });

      const result = await service.update(1, timeUpdateDto, 1);

      expect(mockBookingRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a booking successfully', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.remove.mockResolvedValue(undefined);

      await service.remove(1, 1);

      expect(mockBookingRepository.remove).toHaveBeenCalledWith(mockBooking);
    });

    it('should throw BadRequestException when user is not the owner', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.remove(1, 2)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('should return bookings for specific user', async () => {
      const bookings = [mockBooking];
      mockBookingRepository.find.mockResolvedValue(bookings);

      const result = await service.findByUser(1);

      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['court'],
        order: {
          startTime: 'DESC',
        },
      });
      expect(result).toEqual(bookings);
    });
  });
});
