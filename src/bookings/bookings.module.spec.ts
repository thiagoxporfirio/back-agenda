import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingsModule } from './bookings.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';

describe('BookingsModule', () => {
  let module: TestingModule;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BookingsModule],
    })
      .overrideProvider(getRepositoryToken(Booking))
      .useValue(mockRepository)
      .overrideProvider(getRepositoryToken(Court))
      .useValue(mockRepository)
      .compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide BookingsService', () => {
    const service = module.get<BookingsService>(BookingsService);
    expect(service).toBeDefined();
  });

  it('should provide BookingsController', () => {
    const controller = module.get<BookingsController>(BookingsController);
    expect(controller).toBeDefined();
  });
});
