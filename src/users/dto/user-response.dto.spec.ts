import { UserResponseDto } from './user-response.dto';

describe('UserResponseDto', () => {
  it('should be defined', () => {
    const dto = new UserResponseDto();
    expect(dto).toBeDefined();
  });

  it('should create a user response DTO with all properties', () => {
    const dto = new UserResponseDto();
    dto.id = 1;
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.phone = '11999999999';
    dto.role = 'user';

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('Test User');
    expect(dto.email).toBe('test@example.com');
    expect(dto.phone).toBe('11999999999');
    expect(dto.role).toBe('user');
  });

  it('should not have a password property', () => {
    const dto = new UserResponseDto();
    expect(dto).not.toHaveProperty('password');
  });

  it('should handle admin role', () => {
    const dto = new UserResponseDto();
    dto.role = 'admin';
    expect(dto.role).toBe('admin');
  });
});
