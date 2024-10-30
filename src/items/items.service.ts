import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  create(createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(id: number) {
    // TODO: Check if the item exists
    const item = this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // If the item exists, return it
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    const item = this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    });
  }

  remove(id: number) {
    // TODO: Check if the item exists
    const item = this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // If the item exists, delete it
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
