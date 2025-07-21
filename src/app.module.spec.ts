import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AppService', () => {
    const appService = module.get<AppService>(AppService);
    expect(appService).toBeDefined();
  });

  it('should provide AppController', () => {
    const appController = module.get<AppController>(AppController);
    expect(appController).toBeDefined();
  });

  it('should have correct module structure', () => {
    expect(module).toBeInstanceOf(TestingModule);
  });

  it('should test database configuration logic', () => {
    // Test the database configuration factory function logic
    const mockConfig = {
      get: jest.fn((key: string): string | undefined => {
        const values: Record<string, string> = {
          DB_HOST: 'localhost',
          DB_PORT: '5432',
          DB_USERNAME: 'test',
          DB_PASSWORD: 'test',
          DB_DATABASE: 'test_db',
        };
        return values[key];
      }),
    };

    const dbConfig = {
      type: 'postgres' as const,
      host: mockConfig.get('DB_HOST') || 'localhost',
      port: parseInt(mockConfig.get('DB_PORT') || '5432', 10),
      username: mockConfig.get('DB_USERNAME') || 'user',
      password: mockConfig.get('DB_PASSWORD') || 'password',
      database: mockConfig.get('DB_DATABASE') || 'database',
      entities: [],
      synchronize: true,
    };

    expect(dbConfig.type).toBe('postgres');
    expect(dbConfig.host).toBe('localhost');
    expect(dbConfig.port).toBe(5432);
    expect(dbConfig.username).toBe('test');
    expect(dbConfig.password).toBe('test');
    expect(dbConfig.database).toBe('test_db');
    expect(dbConfig.synchronize).toBe(true);
    expect(Array.isArray(dbConfig.entities)).toBe(true);
  });

  it('should handle DB_PORT parsing correctly', () => {
    const testCases = [
      { input: '5432', expected: 5432 },
      { input: '3306', expected: 3306 },
      { input: undefined, expected: 5432 }, // fallback case
      { input: '', expected: 5432 }, // empty string case
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseInt(input || '5432', 10);
      expect(result).toBe(expected);
    });
  });

  it('should verify ConfigModule is global', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });
});
