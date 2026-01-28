import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TutorialesService } from '../tutoriales.service';
import { CreateTutorialDto } from '../application/dto/create-tutorial.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';

@Controller('tutoriales')
export class TutorialesController {
    constructor(private readonly tutorialesService: TutorialesService) { }

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
}
