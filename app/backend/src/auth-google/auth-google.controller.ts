import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthGoogleService } from './auth-google.service';

/**
 * Controller para autenticacion OAuth con Google.
 *
 * Endpoints:
 *   GET /api/auth/google           -> redirige a Google para autorizar
 *   GET /api/auth/google/callback  -> Google redirige aqui con el code
 *
 * Flujo:
 *  1. Usuario hace click en "Continuar con Google" desde el frontend.
 *  2. Frontend redirige a /api/auth/google.
 *  3. NestJS redirige a Google con los scopes configurados.
 *  4. Google autentica y redirige a /api/auth/google/callback con code.
 *  5. NestJS intercambia code por tokens, obtiene perfil, crea JWT.
 *  6. NestJS redirige a FRONTEND_URL/auth/callback?token=...&user=...
 *  7. Frontend guarda token+user en localStorage y redirige al home.
 */
@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  /**
   * Inicia el flujo OAuth redirigiendo al usuario a Google.
   */
  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirige automaticamente a Google.
    // Este metodo nunca se ejecuta, pero NestJS lo necesita.
  }

  /**
   * Callback de Google despues de la autenticacion.
   */
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authGoogleService.handleGoogleLogin(req.user);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const params = new URLSearchParams({
        token: result.access_token,
        user: JSON.stringify(result.user),
      });

      res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
  }
}