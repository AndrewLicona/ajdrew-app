import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TutorialesService } from '../tutoriales.service';
import { CreateTutorialDto } from '../application/dto/create-tutorial.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';

@Controller('tutoriales')
export class TutorialesController {
  constructor(private readonly tutorialesService: TutorialesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateTutorialDto) {
    return this.tutorialesService.create(dto);
  }

  @Get()
  findAll(
    @Query('juegoId') juegoId?: string,
    @Query('destacado') destacado?: string,
  ) {
    const query: any = {};
    if (destacado === 'true') query.destacado = true;
    query.activo = true; // Public only shows active
    return this.tutorialesService.findAll(juegoId, query);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllAdmin(@Query('juegoId') juegoId?: string) {
    return this.tutorialesService.findAll(juegoId);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.tutorialesService.findOne(idOrSlug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.tutorialesService.update(id, dto);
  }

  @Post(':id/utilidad')
  incrementUtilidad(@Param('id') id: string) {
    return this.tutorialesService.incrementUtilidad(id);
  }

  @Post(':id/compartir')
  incrementCompartir(@Param('id') id: string) {
    return this.tutorialesService.incrementCompartir(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string) {
    return this.tutorialesService.remove(id);
  }

  @Post('sugerir')
  sugerir(@Body() body: any) {
    // Simple slugify for suggestion
    const slug =
      body.titulo
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const dto: CreateTutorialDto = {
      titulo: body.titulo,
      slug: slug,
      videoUrl: body.videoUrl,
      descripcion: body.descripcion || '',
      juegoId: body.juegoId,
      dificultad: 'MEDIO', // Default for suggestions
      activo: false, // FORCE INACTIVE
      destacado: false,
      autor: body.autor || null,
      autorUrl: body.autorUrl || null,
      imageCover: body.imageCover || null,
      pasos: body.pasos
        ? body.pasos.map((p: any, index: number) => ({
            orden: index + 1,
            titulo: p.titulo,
            descripcion: p.descripcion,
            image: p.image || null, // Map step image
          }))
        : [],
    } as any; // Cast to any to bypass optional check if strict

    return this.tutorialesService.create(dto);
  }
}
