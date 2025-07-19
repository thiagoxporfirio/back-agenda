import { Test, TestingModule } from '@nestjs/testing';
import { CourtsController } from './courts.controller';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Court } from '../entities/court.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('CourtsController', () => {
  let controller: CourtsController;

  const mockCourt: Court = {
    id: 1,
    name: 'Quadra de Tênis 1',
    description: 'Quadra de tênis com piso sintético',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    bookings: [],
  };

  const mockCourtsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtsController],
      providers: [
        {
          provide: CourtsService,
          useValue: mockCourtsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CourtsController>(CourtsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new court', async () => {
      const createCourtDto: CreateCourtDto = {
        name: 'Quadra de Tênis 1',
        description: 'Quadra de tênis com piso sintético',
      };

      mockCourtsService.create.mockResolvedValue(mockCourt);

      const result = await controller.create(createCourtDto);

      expect(mockCourtsService.create).toHaveBeenCalledWith(createCourtDto);
      expect(result).toEqual(mockCourt);
    });
  });

  describe('findAll', () => {
    it('should return an array of courts', async () => {
      const courts = [mockCourt];
      mockCourtsService.findAll.mockResolvedValue(courts);

      const result = await controller.findAll();

      expect(mockCourtsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(courts);
    });
  });

  describe('findOne', () => {
    it('should return a single court', async () => {
      mockCourtsService.findOne.mockResolvedValue(mockCourt);

      const result = await controller.findOne(1);

      expect(mockCourtsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCourt);
    });
  });

  describe('update', () => {
    it('should update a court', async () => {
      const updateCourtDto: UpdateCourtDto = {
        name: 'Quadra de Tênis Atualizada',
      };

      const updatedCourt = { ...mockCourt, ...updateCourtDto };
      mockCourtsService.update.mockResolvedValue(updatedCourt);

      const result = await controller.update(1, updateCourtDto);

      expect(mockCourtsService.update).toHaveBeenCalledWith(1, updateCourtDto);
      expect(result).toEqual(updatedCourt);
    });
  });

  describe('remove', () => {
    it('should remove a court', async () => {
      mockCourtsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockCourtsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
