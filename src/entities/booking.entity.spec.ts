import { Booking } from './booking.entity';
import { Court } from './court.entity';
import { User } from './user.entity';

describe('Booking Entity', () => {
  it('should create a booking instance', () => {
    const booking = new Booking();
    booking.id = 1;
    booking.userId = 1;
    booking.courtId = 1;
    booking.startTime = new Date('2025-07-18T10:00:00');
    booking.endTime = new Date('2025-07-18T11:00:00');
    booking.duration = 1.0;
    booking.status = 'pending';

    expect(booking).toBeDefined();
    expect(booking.id).toBe(1);
    expect(booking.userId).toBe(1);
    expect(booking.courtId).toBe(1);
    expect(booking.startTime).toBeInstanceOf(Date);
    expect(booking.endTime).toBeInstanceOf(Date);
    expect(booking.duration).toBe(1.0);
    expect(booking.status).toBe('pending');
  });

  it('should have correct properties', () => {
    const booking = new Booking();

    expect(booking).toHaveProperty('id');
    expect(booking).toHaveProperty('userId');
    expect(booking).toHaveProperty('courtId');
    expect(booking).toHaveProperty('startTime');
    expect(booking).toHaveProperty('endTime');
    expect(booking).toHaveProperty('duration');
    expect(booking).toHaveProperty('status');
    expect(booking).toHaveProperty('notes');
    expect(booking).toHaveProperty('createdAt');
    expect(booking).toHaveProperty('updatedAt');
    expect(booking).toHaveProperty('court');
    expect(booking).toHaveProperty('user');
  });

  it('should accept valid date range', () => {
    const booking = new Booking();
    const startDate = new Date('2025-07-18T09:00:00');
    const endDate = new Date('2025-07-18T10:00:00');

    booking.startTime = startDate;
    booking.endTime = endDate;
    booking.duration = 1.0;

    expect(booking.startTime).toEqual(startDate);
    expect(booking.endTime).toEqual(endDate);
    expect(booking.endTime.getTime()).toBeGreaterThan(
      booking.startTime.getTime(),
    );
    expect(booking.duration).toBe(1.0);
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

  it('should handle optional notes field', () => {
    const booking = new Booking();

    // Test without notes
    expect(booking.notes).toBeUndefined();

    // Test with notes
    booking.notes = 'Reserva para treinamento especial';
    expect(booking.notes).toBe('Reserva para treinamento especial');
  });

  it('should handle timestamp fields', () => {
    const booking = new Booking();
    const now = new Date();

    booking.createdAt = now;
    booking.updatedAt = now;

    expect(booking.createdAt).toEqual(now);
    expect(booking.updatedAt).toEqual(now);
    expect(booking.createdAt).toBeInstanceOf(Date);
    expect(booking.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle court relationship', () => {
    const booking = new Booking();
    const court = new Court();
    court.id = 1;
    court.name = 'Quadra de Tênis';

    booking.court = court;

    expect(booking.court).toBeDefined();
    expect(booking.court).toBeInstanceOf(Court);
    expect(booking.court.id).toBe(1);
    expect(booking.court.name).toBe('Quadra de Tênis');
  });

  it('should handle user relationship', () => {
    const booking = new Booking();
    const user = new User();
    user.id = 1;
    user.name = 'Test User';

    booking.user = user;

    expect(booking.user).toBeDefined();
    expect(booking.user).toBeInstanceOf(User);
    expect(booking.user.id).toBe(1);
    expect(booking.user.name).toBe('Test User');
  });

  it('should handle entity metadata for relationships', () => {
    const booking = new Booking();

    // Test that the relationship properties exist
    expect('court' in booking).toBe(true);
    expect('user' in booking).toBe(true);

    // Test initial state
    expect(booking.court).toBeUndefined();
    expect(booking.user).toBeUndefined();
  });
});
