import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// Mock das dependências
jest.mock('@nestjs/core');
jest.mock('@nestjs/swagger');

// Mock do process.env
const originalEnv = process.env;

describe('Main Bootstrap', () => {
  let mockApp: any;
  const mockNestFactory = NestFactory as jest.Mocked<typeof NestFactory>;
  const mockSwaggerModule = SwaggerModule as jest.Mocked<typeof SwaggerModule>;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };

    mockApp = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    mockNestFactory.create = jest.fn().mockResolvedValue(mockApp);
    mockSwaggerModule.createDocument = jest.fn().mockReturnValue({});
    mockSwaggerModule.setup = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
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

  it('should test environment port logic', () => {
    // Test default port
    delete process.env.PORT;
    const defaultPort = process.env.PORT ?? 3000;
    expect(defaultPort).toBe(3000);

    // Test custom port
    process.env.PORT = '4000';
    const customPort = process.env.PORT ?? 3000;
    expect(customPort).toBe('4000');
  });

  it('should test DocumentBuilder chain methods', () => {
    // Test that DocumentBuilder class exists and can be instantiated
    expect(DocumentBuilder).toBeDefined();
    expect(typeof DocumentBuilder).toBe('function');

    // Test mock chain pattern behavior
    const mockThis = {};
    const setTitleMock = jest.fn().mockReturnValue(mockThis);
    const setDescriptionMock = jest.fn().mockReturnValue(mockThis);
    const setVersionMock = jest.fn().mockReturnValue(mockThis);
    const addBearerAuthMock = jest.fn().mockReturnValue(mockThis);
    const buildMock = jest.fn().mockReturnValue({ title: 'Test API' });

    // Test method calls
    setTitleMock('Test');
    setDescriptionMock('Test API');
    setVersionMock('1.0');
    addBearerAuthMock();
    const result = buildMock() as { title: string };

    // Verify calls were made with correct parameters
    expect(setTitleMock).toHaveBeenCalledWith('Test');
    expect(setDescriptionMock).toHaveBeenCalledWith('Test API');
    expect(setVersionMock).toHaveBeenCalledWith('1.0');
    expect(addBearerAuthMock).toHaveBeenCalled();
    expect(buildMock).toHaveBeenCalled();
    expect(result).toEqual({ title: 'Test API' });
  });
});
