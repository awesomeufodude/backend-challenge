import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  addToInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.addToInventory(createInventoryDto);
  }

  @Get(':survivorId')
  findAllInventoryItems(@Param('survivorId', ParseIntPipe) survivorId: number) {
    return this.inventoryService.findAllInventoryItems(survivorId);
  }

  @Get(':survivorId/items/:itemId')
  findInventoryItem(
    @Param('survivorId', ParseIntPipe) survivorId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.inventoryService.findInventoryItem(survivorId, itemId);
  }

  @Patch(':id')
  updateInventoryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateInventoryItem(id, updateInventoryDto);
  }

  @Delete(':id')
  deleteInventoryItem(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventoryItem(id);
  }
}
