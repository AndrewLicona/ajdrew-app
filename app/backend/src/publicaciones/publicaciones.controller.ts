import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly publicacionesService: PublicacionesService) { }

    @Get()
    findAll() {
        return this.publicacionesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.publicacionesService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.publicacionesService.remove(id);
    }
}
