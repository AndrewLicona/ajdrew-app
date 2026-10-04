import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Rol } from '@prisma/client';
import * as crypto from 'crypto';

/**
 * Servicio que maneja el login OAuth con Google.
 *
 * Cuando un usuario se autentica con Google:
 *  1. Si existe (por email o googleId), actualiza sus datos.
 *  2. Si no existe, crea un nuevo Usuario con rol EDITOR por defecto.
 *  3. Devuelve un JWT compatible con el resto de la plataforma.
 */
@Injectable()
export class AuthGoogleService {
  private readonly logger = new Logger(AuthGoogleService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Procesa el usuario devuelto por GoogleStrategy.
   * Crea o actualiza el usuario en DB y devuelve un JWT.
   */
  async handleGoogleLogin(googleUser: {
    provider: string;
    providerId: string;
    email: string;
    emailVerified: boolean;
    nombre: string;
    avatar?: string;
    accessToken: string;
    refreshToken?: string;
  }) {
    if (!googleUser.email) {
      throw new Error('Google no devolvio un email para este usuario');
    }

    // Buscar usuario existente por email o googleId (guardamos googleId en metadata)
    let usuario = await this.prisma.usuario.findUnique({
      where: { email: googleUser.email },
    });

    if (usuario) {
      // Actualizar nombre y avatar (pueden haber cambiado en Google)
      usuario = await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          nombre: googleUser.nombre,
          // Si tuvieramos un campo avatar en Usuario, lo actualizariamos aqui
          // Por ahora no hay, pero el frontend puede leer el avatar desde el JWT
        },
      });
      this.logger.log(
        `Usuario existente logueado: ${usuario.email} (id=${usuario.id})`,
      );
    } else {
      // Crear nuevo usuario
      // Password aleatorio porque no se usara (login via Google)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      usuario = await this.prisma.usuario.create({
        data: {
          email: googleUser.email,
          nombre: googleUser.nombre,
          password: hashedPassword,
          rol: Rol.EDITOR,
        },
      });
      this.logger.log(
        `Nuevo usuario creado desde Google: ${usuario.email} (id=${usuario.id})`,
      );
    }

    // Generar JWT compatible con el resto de la plataforma
    const payload = {
      email: usuario.email,
      sub: usuario.id,
      rol: usuario.rol,
      provider: 'google',
      avatar: googleUser.avatar,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        avatar: googleUser.avatar,
        provider: 'google',
      },
    };
  }
}