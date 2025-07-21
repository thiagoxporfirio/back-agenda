import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiBody({
    description: 'Dados do usuário',
    examples: {
      user: {
        summary: 'Usuário comum',
        value: {
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999999999',
          password: '123456',
          role: 'user',
        },
      },
      admin: {
        summary: 'Usuário administrador',
        value: {
          name: 'Admin Sistema',
          email: 'admin@email.com',
          phone: '11888888888',
          password: '123456',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    example: {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      role: 'user',
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    example: [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        role: 'user',
      },
      {
        id: 2,
        name: 'Admin Sistema',
        email: 'admin@email.com',
        phone: '11888888888',
        role: 'admin',
      },
    ],
  })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas admin' })
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID (admin ou próprio usuário)' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
    example: {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      role: 'user',
    },
  })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    // Permite admin ou o próprio usuário
    if (req.user.role !== 'admin' && req.user.id !== +id) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário (admin ou próprio usuário)' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiBody({
    description: 'Dados para atualização (todos opcionais)',
    examples: {
      update_name: {
        summary: 'Atualizar apenas nome',
        value: {
          name: 'João Santos',
        },
      },
      update_password: {
        summary: 'Atualizar senha',
        value: {
          password: 'nova_senha_123',
        },
      },
      update_all: {
        summary: 'Atualizar todos os campos',
        value: {
          name: 'João Santos Silva',
          email: 'joao.santos@email.com',
          phone: '11777777777',
          password: 'nova_senha_123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    example: {
      id: 1,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '11999999999',
      role: 'user',
    },
  })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.update(+id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário (admin ou próprio usuário)' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.usersService.remove(+id, req.user);
  }
}
