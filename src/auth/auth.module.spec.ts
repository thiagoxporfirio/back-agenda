import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

describe('AuthModule', () => {
  it('should export AuthService', () => {
    expect(AuthService).toBeDefined();
    expect(typeof AuthService).toBe('function');
  });

  it('should export AuthController', () => {
    expect(AuthController).toBeDefined();
    expect(typeof AuthController).toBe('function');
  });

  it('should export JwtStrategy', () => {
    expect(JwtStrategy).toBeDefined();
    expect(typeof JwtStrategy).toBe('function');
  });

  it('should export RolesGuard', () => {
    expect(RolesGuard).toBeDefined();
    expect(typeof RolesGuard).toBe('function');
  });
});
