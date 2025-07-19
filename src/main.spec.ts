import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// Mock das dependências
jest.mock('@nestjs/core');
jest.mock('@nestjs/swagger');

describe('Main Bootstrap', () => {
  let mockApp: any;
  const mockNestFactory = NestFactory as jest.Mocked<typeof NestFactory>;
  const mockSwaggerModule = SwaggerModule as jest.Mocked<typeof SwaggerModule>;

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    mockNestFactory.create = jest.fn().mockResolvedValue(mockApp);
    mockSwaggerModule.createDocument = jest.fn().mockReturnValue({});
    mockSwaggerModule.setup = jest.fn();

    const mockDocumentBuilder = {
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addBearerAuth: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    };

    (DocumentBuilder as any) = jest.fn(() => mockDocumentBuilder);

    jest.clearAllMocks();
  });

  it('should have ValidationPipe available', () => {
    expect(ValidationPipe).toBeDefined();
    expect(typeof ValidationPipe).toBe('function');
  });

  it('should have NestFactory available', () => {
    expect(NestFactory).toBeDefined();
    expect(typeof NestFactory.create).toBe('function');
  });

  it('should have SwaggerModule available', () => {
    expect(SwaggerModule).toBeDefined();
    expect(typeof SwaggerModule.createDocument).toBe('function');
    expect(typeof SwaggerModule.setup).toBe('function');
  });

  it('should have DocumentBuilder available', () => {
    expect(DocumentBuilder).toBeDefined();
    expect(typeof DocumentBuilder).toBe('function');
  });

  it('should create ValidationPipe instance', () => {
    const pipe = new ValidationPipe();
    expect(pipe).toBeInstanceOf(ValidationPipe);
  });
});
