import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Court } from '../entities/court.entity';

@ApiTags('courts')
@Controller('courts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar uma nova quadra' })
  @ApiResponse({
    status: 201,
    description: 'Quadra criada com sucesso.',
    type: Court,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas administradores podem criar quadras.',
  })
  async create(@Body() createCourtDto: CreateCourtDto): Promise<Court> {
    return await this.courtsService.create(createCourtDto);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Listar todas as quadras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de quadras retornada com sucesso.',
    type: [Court],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  async findAll(): Promise<Court[]> {
    return await this.courtsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Buscar uma quadra por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da quadra',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Quadra encontrada.',
    type: Court,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quadra não encontrada.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Court> {
    return await this.courtsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar uma quadra' })
  @ApiParam({
    name: 'id',
    description: 'ID da quadra',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Quadra atualizada com sucesso.',
    type: Court,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado. Apenas administradores podem atualizar quadras.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quadra não encontrada.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourtDto: UpdateCourtDto,
  ): Promise<Court> {
    return await this.courtsService.update(id, updateCourtDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Excluir uma quadra' })
  @ApiParam({
    name: 'id',
    description: 'ID da quadra',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Quadra excluída com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas administradores podem excluir quadras.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quadra não encontrada.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.courtsService.remove(id);
  }
}
