import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

/**
 * Estrategia OAuth 2.0 de Google.
 *
 * Scopes solicitados:
 *  - email + profile: para identificar al usuario
 *  - youtube.readonly: para leer datos del canal de YT del usuario
 *  - youtube.force-ssl: para subir Shorts a su canal (opcional, depende de scopes aprobados)
 *
 * Para configurar:
 *  1. Crear proyecto en Google Cloud Console: https://console.cloud.google.com
 *  2. Habilitar YouTube Data API v3
 *  3. Crear credenciales OAuth 2.0 (tipo Web application)
 *  4. Agregar URI de redireccion: https://tudominio.com/api/auth/google/callback
 *  5. Copiar CLIENT_ID y CLIENT_SECRET al .env
 *
 * Variables de entorno:
 *  - GOOGLE_CLIENT_ID
 *  - GOOGLE_CLIENT_SECRET
 *  - GOOGLE_CALLBACK_URL (ej: https://ajdrew.site/api/auth/google/callback)
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_SECRET',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/api/auth/google/callback',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      passReqToCallback: false,
    });
  }

  /**
   * Callback que Passport invoca cuando Google valida el token.
   * Devuelve un objeto "user" que NestJS inyecta en req.user.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name: names, emails, photos, id } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails?.[0]?.value,
      emailVerified: emails?.[0]?.verified || false,
      nombre: names?.givenName
        ? `${names.givenName} ${names.familyName || ''}`.trim()
        : emails?.[0]?.value?.split('@')[0] || 'Usuario',
      avatar: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    this.logger.log(`Google OAuth user: ${user.email}`);
    done(null, user);
  }
}