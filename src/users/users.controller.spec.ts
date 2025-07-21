/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '11999999999',
    role: 'user' as const,
  };

  const mockAdmin: AuthenticatedUser = {
    id: 2,
    email: 'admin@example.com',
    role: 'admin',
  };

  const mockUserAuth: AuthenticatedUser = {
    id: 1,
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'newuser@example.com',
      phone: '11988888888',
      password: 'password123',
      role: 'user',
    };

    it('should create a new user', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      usersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    const req = { user: mockUserAuth } as never;
    const adminReq = { user: mockAdmin } as never;

    it('should return user when admin requests any user', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1', adminReq);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should return user when user requests own profile', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1', req);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException when user tries to access another user', async () => {
      await expect(controller.findOne('2', req)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(controller.findOne('2', req)).rejects.toThrow(
        'Acesso negado',
      );
      expect(usersService.findOne).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };
    const req = { user: mockUserAuth } as never;

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      usersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto, req);

      expect(usersService.update).toHaveBeenCalledWith(
        1,
        updateUserDto,
        mockUserAuth,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    const req = { user: mockUserAuth } as never;

    it('should remove user successfully', async () => {
      usersService.remove.mockResolvedValue();

      await controller.remove('1', req);

      expect(usersService.remove).toHaveBeenCalledWith(1, mockUserAuth);
    });
  });
});
