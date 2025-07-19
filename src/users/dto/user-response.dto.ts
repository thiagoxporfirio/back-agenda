import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '11999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;
}
