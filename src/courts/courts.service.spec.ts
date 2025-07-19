import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { Court } from '../entities/court.entity';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

describe('CourtsService', () => {
  let service: CourtsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourtsService,
        {
          provide: getRepositoryToken(Court),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourtsService>(CourtsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new court successfully', async () => {
      const createCourtDto: CreateCourtDto = {
        name: 'Quadra de Tênis 1',
        description: 'Quadra de tênis com piso sintético',
      };

      const mockCourt = {
        id: 1,
        ...createCourtDto,
      };

      mockRepository.create.mockReturnValue(mockCourt);
      mockRepository.save.mockResolvedValue(mockCourt);

      const result = await service.create(createCourtDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCourtDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCourt);
      expect(result).toEqual(mockCourt);
    });
  });

  describe('findAll', () => {
    it('should return all courts ordered by name', async () => {
      const mockCourts = [
        { id: 1, name: 'Quadra A', description: 'Descrição A' },
        { id: 2, name: 'Quadra B', description: 'Descrição B' },
      ];

      mockRepository.find.mockResolvedValue(mockCourts);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockCourts);
    });

    it('should return empty array when no courts exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a court when found', async () => {
      const mockCourt = {
        id: 1,
        name: 'Quadra de Tênis 1',
        description: 'Quadra de tênis',
      };

      mockRepository.findOne.mockResolvedValue(mockCourt);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCourt);
    });

    it('should throw NotFoundException when court not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Quadra com ID 999 não encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update a court successfully', async () => {
      const updateCourtDto: UpdateCourtDto = {
        name: 'Quadra Atualizada',
        description: 'Nova descrição',
      };

      const existingCourt = {
        id: 1,
        name: 'Quadra Original',
        description: 'Descrição original',
      };

      const updatedCourt = {
        ...existingCourt,
        ...updateCourtDto,
      };

      mockRepository.findOne.mockResolvedValue(existingCourt);
      mockRepository.save.mockResolvedValue(updatedCourt);

      const result = await service.update(1, updateCourtDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedCourt);
      expect(result).toEqual(updatedCourt);
    });

    it('should throw NotFoundException when trying to update non-existent court', async () => {
      const updateCourtDto: UpdateCourtDto = {
        name: 'Quadra Atualizada',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateCourtDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a court successfully', async () => {
      const mockCourt = {
        id: 1,
        name: 'Quadra a ser removida',
        description: 'Descrição',
      };

      mockRepository.findOne.mockResolvedValue(mockCourt);
      mockRepository.remove.mockResolvedValue(mockCourt);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCourt);
    });

    it('should throw NotFoundException when trying to remove non-existent court', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
