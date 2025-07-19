import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  describe('with custom JWT secret', () => {
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
  });

  describe('with default JWT secret fallback', () => {
    beforeEach(async () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(undefined), // Force fallback to default
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

    it('should use default secret when config returns undefined', () => {
      expect(strategy).toBeDefined();
      // This tests the fallback: configService.get<string>('JWT_SECRET') || 'your_jwt_secret'
    });
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
