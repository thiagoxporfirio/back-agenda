import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Fazer login e obter token JWT' })
  @ApiBody({
    description: 'Credenciais de login',
    examples: {
      user: {
        summary: 'Login usuário comum',
        value: {
          email: 'joao@email.com',
          password: '123456',
        },
      },
      admin: {
        summary: 'Login administrador',
        value: {
          email: 'admin@email.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
    examples: {
      success: {
        summary: 'Login de usuário comum',
        value: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'joao@email.com',
            role: 'user',
          },
        },
      },
      admin: {
        summary: 'Login de administrador',
        value: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 2,
            email: 'admin@email.com',
            role: 'admin',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}
