import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;
}
