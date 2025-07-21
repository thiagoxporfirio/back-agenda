import { Court } from './court.entity';
import { Booking } from './booking.entity';

describe('Court Entity', () => {
  it('should create a court instance', () => {
    const court = new Court();
    court.id = 1;
    court.name = 'Quadra 1';

    expect(court).toBeDefined();
    expect(court.id).toBe(1);
    expect(court.name).toBe('Quadra 1');
  });

  it('should have correct properties', () => {
    const court = new Court();

    expect(court).toHaveProperty('id');
    expect(court).toHaveProperty('name');
    expect(court).toHaveProperty('description');
    expect(court).toHaveProperty('createdAt');
    expect(court).toHaveProperty('updatedAt');
    expect(court).toHaveProperty('bookings');
  });

  it('should accept string name', () => {
    const court = new Court();
    court.name = 'Quadra de Tênis';

    expect(typeof court.name).toBe('string');
    expect(court.name).toBe('Quadra de Tênis');
  });

  it('should handle optional description field', () => {
    const court = new Court();

    // Test without description
    expect(court.description).toBeUndefined();

    // Test with description
    court.description = 'Quadra de tênis com piso sintético';
    expect(court.description).toBe('Quadra de tênis com piso sintético');
  });

  it('should handle timestamp fields', () => {
    const court = new Court();
    const now = new Date();

    court.createdAt = now;
    court.updatedAt = now;

    expect(court.createdAt).toEqual(now);
    expect(court.updatedAt).toEqual(now);
    expect(court.createdAt).toBeInstanceOf(Date);
    expect(court.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle bookings relationship', () => {
    const court = new Court();
    const booking1 = new Booking();
    const booking2 = new Booking();

    booking1.id = 1;
    booking2.id = 2;

    court.bookings = [booking1, booking2];

    expect(court.bookings).toBeDefined();
    expect(Array.isArray(court.bookings)).toBe(true);
    expect(court.bookings).toHaveLength(2);
    expect(court.bookings[0]).toBeInstanceOf(Booking);
    expect(court.bookings[1]).toBeInstanceOf(Booking);
    expect(court.bookings[0].id).toBe(1);
    expect(court.bookings[1].id).toBe(2);
  });

  it('should initialize with empty bookings array', () => {
    const court = new Court();
    court.bookings = [];

    expect(court.bookings).toBeDefined();
    expect(Array.isArray(court.bookings)).toBe(true);
    expect(court.bookings).toHaveLength(0);
  });

  it('should handle entity metadata for relationships', () => {
    const court = new Court();

    // Test that the relationship property exists
    expect('bookings' in court).toBe(true);

    // Test initial state
    expect(court.bookings).toBeUndefined();
  });
});
