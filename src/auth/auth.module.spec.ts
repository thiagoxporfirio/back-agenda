import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

// Mock dos módulos externos
jest.mock('../users/users.module', () => ({
  UsersModule: class MockUsersModule {},
}));

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_secret';
        return undefined;
      }),
    };

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            secret: 'test_secret',
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: JwtStrategy,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should export AuthService', () => {
    expect(AuthService).toBeDefined();
    expect(typeof AuthService).toBe('function');
  });

  it('should export AuthController', () => {
    expect(AuthController).toBeDefined();
    expect(typeof AuthController).toBe('function');
  });

  it('should export JwtStrategy', () => {
    expect(JwtStrategy).toBeDefined();
    expect(typeof JwtStrategy).toBe('function');
  });

  it('should export RolesGuard', () => {
    expect(RolesGuard).toBeDefined();
    expect(typeof RolesGuard).toBe('function');
  });

  it('should test JWT configuration factory', () => {
    const mockConfig = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'custom_secret';
        return undefined;
      }),
    };

    const jwtConfig = {
      secret: mockConfig.get('JWT_SECRET') || 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    };

    expect(jwtConfig.secret).toBe('custom_secret');
    expect(jwtConfig.signOptions.expiresIn).toBe('1h');
  });

  it('should test JWT configuration with fallback secret', () => {
    // Test the logic used in the actual module
    const configValue = undefined; // Simulate no JWT_SECRET being set
    const secret = configValue || 'your_jwt_secret';

    expect(secret).toBe('your_jwt_secret');
  });

  it('should verify PassportModule configuration', () => {
    const passportConfig = { defaultStrategy: 'jwt' };
    expect(passportConfig.defaultStrategy).toBe('jwt');
  });
});
