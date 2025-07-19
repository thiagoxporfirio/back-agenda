import { validate } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

describe('CreateBookingDto', () => {
  let dto: CreateBookingDto;

  beforeEach(() => {
    dto = new CreateBookingDto();
  });

  describe('courtId validation', () => {
    it('should pass with valid courtId', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when courtId is not provided', async () => {
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('courtId');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when courtId is not positive', async () => {
      dto.courtId = 0;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('courtId');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });
  });

  describe('startTime validation', () => {
    it('should pass with valid ISO date string', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when startTime is not provided', async () => {
      dto.courtId = 1;
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('startTime');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });

    it('should fail when startTime is not a valid date string', async () => {
      dto.courtId = 1;
      dto.startTime = 'invalid-date';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('startTime');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('duration validation', () => {
    it('should pass with valid duration (0.5)', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 0.5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with valid duration (2.0)', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 2.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when duration is not provided', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('duration');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when duration is less than 0.5', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 0.25;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('duration');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail when duration is more than 4.0', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 5.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('duration');
      expect(errors[0].constraints).toHaveProperty('max');
    });
  });

  describe('status validation', () => {
    it('should pass when status is not provided (optional)', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with valid status', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;
      dto.status = 'confirmed';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with invalid status', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;
      (dto.status as any) = 'invalid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('notes validation', () => {
    it('should pass when notes is not provided (optional)', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with valid notes', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;
      dto.notes = 'Reserva para torneio';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when notes exceeds maxLength', async () => {
      dto.courtId = 1;
      dto.startTime = '2024-07-20T10:00:00.000Z';
      dto.duration = 1.0;
      dto.notes = 'a'.repeat(501);

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('notes');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });
});
