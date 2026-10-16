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
  Req,
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
  participar(@Param('id') id: string, @Body() dto: ParticiparSorteoDto, @Req() req: any) {
    // Merge deviceId from cookie into DTO
    const dtoWithDevice = {
      ...dto,
      deviceId: dto.deviceId || req.deviceId,
    };
    return this.sorteosService.participar(id, dtoWithDevice);
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

  @Patch(':id/tareas/:taskId/verificar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async verificarTarea(
    @Param('id') sorteoId: string,
    @Param('taskId') taskId: string,
    @Body() body: { participanteId: string; verificada: boolean },
  ) {
    return this.sorteosService.verificarTarea(sorteoId, taskId, body.participanteId, body.verificada);
  }

  @Get(':id/participantes')
  getParticipantes(@Param('id') id: string) {
    return this.sorteosService.getParticipantes(id);
  }

  @Get(':id/participantes/:participanteId/entradas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async getEntradasParticipante(
    @Param('id') sorteoId: string,
    @Param('participanteId') participanteId: string,
  ) {
    return this.sorteosService.getEntradasParticipante(participanteId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.sorteosService.remove(id);
  }
}
