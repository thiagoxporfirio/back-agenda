import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Santos',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.santos@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '11777777777',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Nova senha do usuário (mínimo 6 caracteres)',
    example: 'nova_senha_123',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: ['admin', 'user'],
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole;
}
