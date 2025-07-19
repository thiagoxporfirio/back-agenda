import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from '../entities/booking.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('BookingsController', () => {
  let controller: BookingsController;

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

  const mockBookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByDate: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: { id: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<BookingsController>(BookingsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = {
        courtId: 1,
        startTime: '2024-07-20T10:00:00Z',
        duration: 1.0,
      };

      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.create(createBookingDto, mockRequest);

      expect(mockBookingsService.create).toHaveBeenCalledWith(
        createBookingDto,
        1,
      );
      expect(result).toEqual(mockBooking);
    });
  });

  describe('findAll', () => {
    it('should return all bookings when no date is provided', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll();

      expect(mockBookingsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(bookings);
    });

    it('should return bookings by date when date is provided', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findByDate.mockResolvedValue(bookings);

      const result = await controller.findAll('2024-07-20');

      expect(mockBookingsService.findByDate).toHaveBeenCalledWith('2024-07-20');
      expect(result).toEqual(bookings);
    });
  });

  describe('findMyBookings', () => {
    it('should return user bookings', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findByUser.mockResolvedValue(bookings);

      const result = await controller.findMyBookings(mockRequest);

      expect(mockBookingsService.findByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(bookings);
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      mockBookingsService.findOne.mockResolvedValue(mockBooking);

      const result = await controller.findOne(1);

      expect(mockBookingsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateBookingDto: UpdateBookingDto = {
        notes: 'Updated notes',
      };

      const updatedBooking = { ...mockBooking, ...updateBookingDto };
      mockBookingsService.update.mockResolvedValue(updatedBooking);

      const result = await controller.update(1, updateBookingDto, mockRequest);

      expect(mockBookingsService.update).toHaveBeenCalledWith(
        1,
        updateBookingDto,
        1,
      );
      expect(result).toEqual(updatedBooking);
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      mockBookingsService.remove.mockResolvedValue(undefined);

      await controller.remove(1, mockRequest);

      expect(mockBookingsService.remove).toHaveBeenCalledWith(1, 1);
    });
  });
});
