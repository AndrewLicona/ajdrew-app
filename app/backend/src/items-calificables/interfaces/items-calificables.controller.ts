
// items-calificables/interfaces/items-calificables.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Headers } from '@nestjs/common';
import express from 'express';
import { ItemsCalificablesService } from '../application/items-calificables.service';
import { CreateItemCalificableDto } from '../application/dto/create-item-calificable.dto';
import { UpdateItemCalificableDto } from '../application/dto/update-item-calificable.dto';

@Controller('items-calificables')
export class ItemsCalificablesController {
  constructor(private readonly itemsCalificablesService: ItemsCalificablesService) {}

  @Post()
  create(@Body() createItemCalificableDto: CreateItemCalificableDto) {
    return this.itemsCalificablesService.create(createItemCalificableDto);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string, @Headers('x-device-id') deviceId?: string) {
    return this.itemsCalificablesService.findAll(categoryId, deviceId);
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