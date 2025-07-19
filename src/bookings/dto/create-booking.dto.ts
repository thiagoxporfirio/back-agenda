import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsPositive,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID da quadra para reserva',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  courtId: number;

  @ApiProperty({
    description: 'Data e hora de início da reserva',
    example: '2024-07-20T10:00:00.000Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Duração da reserva em horas',
    example: 1.0,
    enum: [0.5, 1.0, 1.5, 2.0],
  })
  @IsNumber()
  @Min(0.5)
  @Max(4.0)
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Status da reserva',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';

  @ApiProperty({
    description: 'Observações adicionais sobre a reserva',
    example: 'Reserva para torneio interno',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
