import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUserDto } from '../../auth/dto/authenticated-user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: AuthenticatedUserDto,
  })
  user: AuthenticatedUserDto;
}
