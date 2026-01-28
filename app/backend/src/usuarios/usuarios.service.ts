import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from './infrastructure/persistence/usuario.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async findByEmail(email: string) {
        return this.usuarioRepository.findByEmail(email);
    }

    async findById(id: string) {
        return this.usuarioRepository.findById(id);
    }

    async create(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.usuarioRepository.create({
            ...data,
            password: hashedPassword,
        });
    }
}
