import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.usuario.create({ data });
  }

  async findAll() {
    return this.prisma.usuario.findMany(); // Sin contraseñas idealmente
  }
}
