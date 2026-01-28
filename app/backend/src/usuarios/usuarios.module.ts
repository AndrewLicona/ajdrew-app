import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioRepository } from './infrastructure/persistence/usuario.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [UsuariosService, UsuarioRepository],
    exports: [UsuariosService],
})
export class UsuariosModule { }
