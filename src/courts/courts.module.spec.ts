import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourtsModule } from './courts.module';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court } from '../entities/court.entity';

describe('CourtsModule', () => {
  let module: TestingModule;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CourtsModule],
    })
      .overrideProvider(getRepositoryToken(Court))
      .useValue(mockRepository)
      .compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CourtsService', () => {
    const service = module.get<CourtsService>(CourtsService);
    expect(service).toBeDefined();
  });

  it('should provide CourtsController', () => {
    const controller = module.get<CourtsController>(CourtsController);
    expect(controller).toBeDefined();
  });
});
