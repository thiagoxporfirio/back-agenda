import { Booking } from './booking.entity';

describe('Booking Entity', () => {
  it('should create a booking instance', () => {
    const booking = new Booking();
    booking.id = 1;
    booking.userId = 1;
    booking.courtId = 1;
    booking.start = new Date('2025-07-18T10:00:00');
    booking.end = new Date('2025-07-18T11:00:00');

    expect(booking).toBeDefined();
    expect(booking.id).toBe(1);
    expect(booking.userId).toBe(1);
    expect(booking.courtId).toBe(1);
    expect(booking.start).toBeInstanceOf(Date);
    expect(booking.end).toBeInstanceOf(Date);
  });

  it('should have correct properties', () => {
    const booking = new Booking();

    expect(booking).toHaveProperty('id');
    expect(booking).toHaveProperty('userId');
    expect(booking).toHaveProperty('courtId');
    expect(booking).toHaveProperty('start');
    expect(booking).toHaveProperty('end');
  });

  it('should accept valid date range', () => {
    const booking = new Booking();
    const startDate = new Date('2025-07-18T09:00:00');
    const endDate = new Date('2025-07-18T10:00:00');

    booking.start = startDate;
    booking.end = endDate;

    expect(booking.start).toEqual(startDate);
    expect(booking.end).toEqual(endDate);
    expect(booking.end.getTime()).toBeGreaterThan(booking.start.getTime());
  });

  it('should accept numeric user and court IDs', () => {
    const booking = new Booking();
    booking.userId = 123;
    booking.courtId = 456;

    expect(typeof booking.userId).toBe('number');
    expect(typeof booking.courtId).toBe('number');
    expect(booking.userId).toBe(123);
    expect(booking.courtId).toBe(456);
  });
});
