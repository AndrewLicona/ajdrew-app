import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SorteosService } from '../sorteos.service';
import { CreateSorteoDto } from '../application/dto/create-sorteo.dto';
import { ParticiparSorteoDto } from '../application/dto/participar-sorteo.dto';
import { AddEntryDto } from '../application/dto/add-entry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';

@Controller('sorteos')
export class SorteosController {
  constructor(private readonly sorteosService: SorteosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createSorteoDto: CreateSorteoDto) {
    return this.sorteosService.create(createSorteoDto);
  }

  @Get()
  findAll(@Query('juegoId') juegoId?: string) {
    return this.sorteosService.findAll(juegoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sorteosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.sorteosService.update(id, updateData);
  }

  @Post(':id/participar')
  participar(@Param('id') id: string, @Body() dto: ParticiparSorteoDto) {
    return this.sorteosService.participar(id, dto);
  }

  @Post('entries')
  addEntry(@Body() dto: AddEntryDto) {
    return this.sorteosService.addEntry(
      dto.participanteId,
      dto.accion,
      dto.origen,
    );
  }

  @Post(':id/elegir-ganadores')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  elegirGanadores(@Param('id') id: string) {
    return this.sorteosService.elegirGanadores(id);
  }

  @Post(':id/finalizar-manual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  finalizarManual(
    @Param('id') id: string,
    @Body() winners: { nombreManual: string; emailManual?: string }[],
  ) {
    return this.sorteosService.finalizarManualmente(id, winners);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.sorteosService.remove(id);
  }
}
