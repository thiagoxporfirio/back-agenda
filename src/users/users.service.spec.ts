/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '11999999999',
    password: 'hashedPassword',
    role: 'user',
  };

  const mockAdmin: AuthenticatedUser = {
    id: 2,
    userId: 2,
    email: 'admin@example.com',
    role: 'admin',
  };

  const mockUserAuth: AuthenticatedUser = {
    id: 1,
    userId: 1,
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));

    // Reset mocks
    jest.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('hashedPassword' as never);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'newuser@example.com',
      phone: '11988888888',
      password: 'password123',
      role: 'user',
    };

    it('should create a new user successfully', async () => {
      const expectedUser = {
        ...mockUser,
        ...createUserDto,
        password: 'hashedPassword',
      };
      repository.create.mockReturnValue(expectedUser);
      repository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
        role: 'user',
      });
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
    });

    it('should create user with default role if not provided', async () => {
      const createUserDtoWithoutRole = { ...createUserDto };
      delete createUserDtoWithoutRole.role;

      const expectedUser = {
        ...mockUser,
        ...createUserDtoWithoutRole,
        password: 'hashedPassword',
      };
      repository.create.mockReturnValue(expectedUser);
      repository.save.mockResolvedValue(expectedUser);

      await service.create(createUserDtoWithoutRole);

      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDtoWithoutRole,
        password: 'hashedPassword',
        role: 'user',
      });
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [
        mockUser,
        {
          ...mockUser,
          id: 2,
          email: 'user2@example.com',
        },
      ];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
    });

    it('should return empty array when no users exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user without password when user exists', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(result).not.toHaveProperty('password');
      expect(result?.id).toBe(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when user exists', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
      expect(result?.password).toBe('hashedPassword');
    });

    it('should return undefined when user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      phone: '11977777777',
    };

    it('should update user successfully when user is admin', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      repository.findOneBy.mockResolvedValue(mockUser);
      repository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto, mockAdmin);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('Updated Name');
    });

    it('should update user successfully when user updates own profile', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      repository.findOneBy.mockResolvedValue(mockUser);
      repository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto, mockUserAuth);

      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should hash password when password is updated', async () => {
      const updateWithPassword = { ...updateUserDto, password: 'newPassword' };
      const updatedUser = {
        ...mockUser,
        ...updateWithPassword,
        password: 'newHashedPassword',
      };

      repository.findOneBy.mockResolvedValue(mockUser);
      repository.save.mockResolvedValue(updatedUser);
      mockBcrypt.hash.mockResolvedValue('newHashedPassword' as never);

      await service.update(1, updateWithPassword, mockAdmin);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, updateUserDto, mockAdmin),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(999, updateUserDto, mockAdmin),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw ForbiddenException when user tries to update another user', async () => {
      repository.findOneBy.mockResolvedValue({ ...mockUser, id: 2 });

      await expect(
        service.update(2, updateUserDto, mockUserAuth),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully when user is admin', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1, mockAdmin);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should remove user successfully when user removes own account', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1, mockUserAuth);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999, mockAdmin)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(999, mockAdmin)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });

    it('should throw ForbiddenException when user tries to remove another user', async () => {
      repository.findOneBy.mockResolvedValue({ ...mockUser, id: 2 });

      await expect(service.remove(2, mockUserAuth)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
