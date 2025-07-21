import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Booking } from '../entities/booking.entity';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Criar uma nova reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso.',
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou conflito de horário.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quadra não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito de horário.',
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: any,
  ): Promise<Booking> {
    return await this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Listar reservas por data ou todas as reservas' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Data para filtrar reservas (YYYY-MM-DD)',
    example: '2024-07-20',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso.',
    type: [Booking],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  async findAll(@Query('date') date?: string): Promise<Booking[]> {
    if (date) {
      return await this.bookingsService.findByDate(date);
    }
    return await this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Listar minhas reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista das reservas do usuário retornada com sucesso.',
    type: [Booking],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  async findMyBookings(@Request() req: any): Promise<Booking[]> {
    return await this.bookingsService.findByUser(req.user.id);
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Buscar uma reserva por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada.',
    type: Booking,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return await this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Atualizar uma reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva atualizada com sucesso.',
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos ou você não tem permissão para atualizar esta reserva.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito de horário.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req: any,
  ): Promise<Booking> {
    return await this.bookingsService.update(id, updateBookingDto, req.user.id);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Cancelar/remover uma reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva removida com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Você não tem permissão para remover esta reserva.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<void> {
    return await this.bookingsService.remove(id, req.user.id);
  }
}
