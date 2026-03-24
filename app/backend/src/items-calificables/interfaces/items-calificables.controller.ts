// items-calificables/interfaces/items-calificables.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Headers, UseGuards } from '@nestjs/common';
import express from 'express';
import { ItemsCalificablesService } from '../application/items-calificables.service';
import { CreateItemCalificableDto } from '../application/dto/create-item-calificable.dto';
import { UpdateItemCalificableDto } from '../application/dto/update-item-calificable.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';

@Controller('items-calificables')
export class ItemsCalificablesController {
  constructor(private readonly itemsCalificablesService: ItemsCalificablesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createItemCalificableDto: CreateItemCalificableDto) {
    return this.itemsCalificablesService.create(createItemCalificableDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  createMany(@Body() items: CreateItemCalificableDto[]) {
    return this.itemsCalificablesService.createMany(items);
  }


  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('tablaId') tablaId?: string,
    @Query('juegoId') juegoId?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Headers('x-device-id') deviceId?: string
  ) {
    return this.itemsCalificablesService.findAll({
      categoryId,
      tablaId,
      ...(juegoId ? { juegoId } : {}),
      search,
      sortBy,
      order,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      deviceId
    } as any);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-device-id') deviceId?: string) {
    return this.itemsCalificablesService.findOne(id, deviceId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemCalificableDto: UpdateItemCalificableDto) {
    return this.itemsCalificablesService.update(id, updateItemCalificableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsCalificablesService.remove(id);

  }


}