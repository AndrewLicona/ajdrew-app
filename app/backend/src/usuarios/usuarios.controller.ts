import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles('ADMIN')
  async findAll() {
    const users = await this.usuariosService.findAll();
    // Eliminar contraseñas de la respuesta
    return users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: any) {
    return this.usuariosService.create(data);
  }
}
