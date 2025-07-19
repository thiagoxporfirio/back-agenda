/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockUser: AuthenticatedUser = {
    id: 1,
    email: 'test@example.com',
    role: 'user',
  };

  const mockAdmin: AuthenticatedUser = {
    id: 2,
    email: 'admin@example.com',
    role: 'admin',
  };

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const createMockContext = (user?: AuthenticatedUser): ExecutionContext => {
      return {
        switchToHttp: () => ({
          getRequest: () => ({
            user,
          }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
    };

    it('should return true when no roles are required', () => {
      reflector.getAllAndOverride.mockReturnValue(null);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true when user has required role', () => {
      reflector.getAllAndOverride.mockReturnValue(['user']);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when admin accesses user-required route', () => {
      reflector.getAllAndOverride.mockReturnValue(['user']);
      const context = createMockContext(mockAdmin);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when admin accesses admin-required route', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext(mockAdmin);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user tries to access admin route', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user role matches one of multiple required roles', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin', 'user']);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when no user is present', () => {
      reflector.getAllAndOverride.mockReturnValue(['user']);
      const context = createMockContext();

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
