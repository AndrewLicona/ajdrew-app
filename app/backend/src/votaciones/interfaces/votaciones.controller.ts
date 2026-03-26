import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { VotacionesService } from '../votaciones.service';
import {
  CreateBracketDto,
  VoteBracketDto,
} from '../application/dto/create-bracket.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';

@Controller('votaciones')
export class VotacionesController {
  constructor(private readonly votacionesService: VotacionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateBracketDto) {
    return this.votacionesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.votacionesService.update(id, dto);
  }

  @Post(':id/advance-round')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  advanceRound(@Param('id') id: string) {
    return this.votacionesService.advanceRound(id);
  }

  @Get()
  findAll(@Query('juegoId') juegoId?: string) {
    return this.votacionesService.findAll(juegoId);
  }

  @Get(':idOrSlug')
  findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Headers('x-device-id') deviceId?: string,
  ) {
    return this.votacionesService.findOne(idOrSlug, deviceId);
  }

  @Post('vote')
  vote(@Body() dto: VoteBracketDto, @Headers('x-device-id') deviceId: string) {
    return this.votacionesService.vote(dto.matchId, dto.itemId, deviceId);
  }

  @Post(':id/delete') // Using POST for deletion to avoid preflight/CORS issues if needed, or stick to DELETE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async remove(@Param('id') id: string) {
    return this.votacionesService.remove(id);
  }
}
