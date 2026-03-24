import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TablasCalificacionService } from './tablas-calificacion.service';
import { CreateTablaCalificacionDto, UpdateTablaCalificacionDto } from './dto/create-tabla-calificacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tablas-calificacion')
export class TablasCalificacionController {
  constructor(private readonly tablasCalificacionService: TablasCalificacionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTablaCalificacionDto: CreateTablaCalificacionDto) {
    return this.tablasCalificacionService.create(createTablaCalificacionDto);
  }

  @Get()
  findAll(
    @Query('juegoId') juegoId?: string,
    @Query('categoriaId') categoriaId?: string,
  ) {
    return this.tablasCalificacionService.findAll(juegoId, categoriaId);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.tablasCalificacionService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTablaCalificacionDto: UpdateTablaCalificacionDto) {
    return this.tablasCalificacionService.update(id, updateTablaCalificacionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablasCalificacionService.remove(id);
  }
}
