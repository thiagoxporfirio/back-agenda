import { validate } from 'class-validator';
import { CreateCourtDto } from './create-court.dto';

describe('CreateCourtDto', () => {
  let dto: CreateCourtDto;

  beforeEach(() => {
    dto = new CreateCourtDto();
  });

  describe('name validation', () => {
    it('should pass with valid name', async () => {
      dto.name = 'Quadra de Tênis 1';
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when name is empty', async () => {
      dto.name = '';
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is not provided', async () => {
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is not a string', async () => {
      (dto.name as any) = 123;
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when name exceeds maxLength', async () => {
      dto.name = 'a'.repeat(101); // 101 characters
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass when name is exactly at maxLength', async () => {
      dto.name = 'a'.repeat(100); // 100 characters
      dto.description = 'Descrição válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('description validation', () => {
    it('should pass when description is valid', async () => {
      dto.name = 'Quadra de Tênis 1';
      dto.description = 'Descrição válida da quadra';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when description is undefined (optional)', async () => {
      dto.name = 'Quadra de Tênis 1';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when description is not a string', async () => {
      dto.name = 'Quadra de Tênis 1';
      (dto.description as any) = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when description exceeds maxLength', async () => {
      dto.name = 'Quadra de Tênis 1';
      dto.description = 'a'.repeat(501); // 501 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass when description is exactly at maxLength', async () => {
      dto.name = 'Quadra de Tênis 1';
      dto.description = 'a'.repeat(500); // 500 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
