import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JuegosService } from '../application/juegos.service';
import { CreateJuegoDto } from '../application/dto/create-juego.dto';
import { UpdateJuegoDto } from '../application/dto/update-juego.dto';

@Controller('juegos')
export class JuegosController {
    constructor(private readonly juegosService: JuegosService) { }

    @Post()
    async create(@Body() createJuegoDto: CreateJuegoDto) {
        try {
            console.log('Creando juego:', createJuegoDto);
            return await this.juegosService.create(createJuegoDto);
        } catch (error) {
            console.error('Error en controller al crear juego:', error);
            throw error;
        }
    }

    @Get()
    findAll() {
        return this.juegosService.findAll();
    }

    @Get(':idOrSlug')
    findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.juegosService.findOne(idOrSlug);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJuegoDto: UpdateJuegoDto) {
        return this.juegosService.update(id, updateJuegoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.juegosService.remove(id);
    }
}
