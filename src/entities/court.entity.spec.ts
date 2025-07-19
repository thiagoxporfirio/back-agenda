import { Court } from './court.entity';

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
  });

  it('should accept string name', () => {
    const court = new Court();
    court.name = 'Quadra de Tênis';

    expect(typeof court.name).toBe('string');
    expect(court.name).toBe('Quadra de Tênis');
  });
});
