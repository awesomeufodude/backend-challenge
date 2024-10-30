import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async addToInventory(createInventoryDto: CreateInventoryDto) {
    const { survivorId, itemId } = createInventoryDto;

    // Check if the survivor and item actually exist
    const [survivorExists, itemExists] = await Promise.all([
      this.prisma.survivor.findUnique({
        where: { id: survivorId },
      }),
      this.prisma.item.findUnique({
        where: { id: itemId },
      }),
    ]);

    if (!survivorExists || !itemExists) {
      throw new BadRequestException('Invalid survivor ID or item ID specified.');
    }

    // Check if the inventory entry already exists
    const inventoryExists = await this.prisma.inventory.findFirst({
      where: {
        survivorId : survivorId,
        itemId : itemId
      },
    });

    if (inventoryExists) {
      throw new ConflictException('This item already exists in the inventory for this survivor.');
    }

    // Create new inventory entry
    return this.prisma.inventory.create({
      data: createInventoryDto,
    });
  }

  findAllInventoryItems(survivorId: number) {
    // Check if the survivor exists in the database
    const survivorExists = this.prisma.survivor.findUnique({
      where: { id: survivorId },
    });
    if (!survivorExists) {
      throw new BadRequestException('Invalid survivor ID specified.');
    }
    return this.prisma.inventory.findMany({
      where: { survivorId },
      include: { Item: true },
    });
  }

  async findInventoryItem(survivorId: number, itemId: number) {
    // Check if the survivor and item exist in the database
    const survivorExists = await this.prisma.survivor.findUnique({
      where: { id: survivorId },
    });
    const itemExists = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!survivorExists || !itemExists) {
      throw new BadRequestException(
        'Invalid survivor ID or item ID specified.',
      );
    }
    return this.prisma.inventory.findMany({
      where: {
        survivorId,
        itemId,
      },
    });
  }

  async updateInventoryItem(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventoryItem = await this.prisma.inventory.findUnique({
      where: { id },
    });
    if (!inventoryItem) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return await this.prisma.inventory.update({
      where: { id },
      data: updateInventoryDto,
    });
  }

  async deleteInventoryItem(id: number) {
    // TODO: Check if the inventory item exists
    const inventoryItem = await this.prisma.inventory.findUnique({
      where: { id },
    });
    if (!inventoryItem) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return this.prisma.inventory.delete({
      where: { id },
    });
  }
}
