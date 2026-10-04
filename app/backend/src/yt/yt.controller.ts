import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { YtService } from './yt.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('yt')
export class YtController {
  constructor(private readonly ytService: YtService) {}

  // ─── Públicos ──────────────────────────────────────────────────────────

  /** GET /api/yt/:slug — datos del viaje para la landing */
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.ytService.findBySlug(slug);
  }

  /** POST /api/yt/:slug/visit — registra una visita anónima */
  @Post(':slug/visit')
  @HttpCode(HttpStatus.CREATED)
  async registrarVisita(
    @Param('slug') slug: string,
    @Body() body: { deviceId: string; accion?: string },
    @Headers('x-device-id') headerDeviceId?: string,
  ) {
    const viaje = await this.ytService.findBySlug(slug);
    const deviceId = body.deviceId || headerDeviceId || 'anon';
    return this.ytService.registrarVisita(viaje.id, deviceId, body.accion || 'view');
  }

  // ─── Admin ─────────────────────────────────────────────────────────────

  /** GET /api/yt — lista todos los viajes (admin) */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAll() {
    return this.ytService.findAll();
  }

  /** POST /api/yt — crea un nuevo viaje (admin) */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() body: any) {
    return this.ytService.create(body);
  }

  /** PUT /api/yt/:id — actualiza un viaje (admin) */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() body: any) {
    return this.ytService.update(id, body);
  }

  /** DELETE /api/yt/:id — elimina un viaje (admin) */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.ytService.remove(id);
  }

  /** GET /api/yt/:id/stats — estadísticas de visitas (admin) */
  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  stats(@Param('id') id: string) {
    return this.ytService.stats(id);
  }
}
