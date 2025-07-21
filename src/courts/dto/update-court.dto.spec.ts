import { validate } from 'class-validator';
import { UpdateCourtDto } from './update-court.dto';

describe('UpdateCourtDto', () => {
  let dto: UpdateCourtDto;

  beforeEach(() => {
    dto = new UpdateCourtDto();
  });

  describe('name validation', () => {
    it('should pass when name is valid', async () => {
      dto.name = 'Quadra Atualizada';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when name is not provided (optional)', async () => {
      dto.description = 'Apenas descrição';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when name is empty string', async () => {
      dto.name = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is not a string', async () => {
      (dto.name as any) = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when name exceeds maxLength', async () => {
      dto.name = 'a'.repeat(101); // 101 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('description validation', () => {
    it('should pass when description is valid', async () => {
      dto.description = 'Descrição atualizada';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when description is not provided (optional)', async () => {
      dto.name = 'Apenas nome';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when description is not a string', async () => {
      (dto.description as any) = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when description exceeds maxLength', async () => {
      dto.description = 'a'.repeat(501); // 501 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  it('should pass when both fields are provided and valid', async () => {
    dto.name = 'Nome Atualizado';
    dto.description = 'Descrição atualizada';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass when no fields are provided (all optional)', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
