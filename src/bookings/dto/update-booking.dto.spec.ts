import { validate } from 'class-validator';
import { UpdateBookingDto } from './update-booking.dto';

describe('UpdateBookingDto', () => {
  let dto: UpdateBookingDto;

  beforeEach(() => {
    dto = new UpdateBookingDto();
  });

  it('should pass when no fields are provided (all optional)', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass when courtId is valid', async () => {
    dto.courtId = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when courtId is not positive', async () => {
    dto.courtId = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('courtId');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should pass when startTime is valid', async () => {
    dto.startTime = '2024-07-20T14:00:00.000Z';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when startTime is invalid', async () => {
    dto.startTime = 'invalid-date';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('startTime');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should pass when duration is valid', async () => {
    dto.duration = 1.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when duration is too small', async () => {
    dto.duration = 0.25;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('duration');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should pass when status is valid', async () => {
    dto.status = 'cancelled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when status is invalid', async () => {
    (dto.status as any) = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should pass when notes is valid', async () => {
    dto.notes = 'Mudança de horário';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when notes exceeds maxLength', async () => {
    dto.notes = 'a'.repeat(501);

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('notes');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
