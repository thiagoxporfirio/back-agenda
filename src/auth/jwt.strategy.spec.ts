import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test_jwt_secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return authenticated user from JWT payload', () => {
      const payload: JwtPayload = {
        email: 'test@example.com',
        sub: 1,
        role: 'user',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
        role: 'user',
      });
    });

    it('should return authenticated admin from JWT payload', () => {
      const payload: JwtPayload = {
        email: 'admin@example.com',
        sub: 2,
        role: 'admin',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 2,
        email: 'admin@example.com',
        role: 'admin',
      });
    });
  });
});
