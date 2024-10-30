import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma.service';
import { create } from 'domain';

const prismaMock = {
  survivor: {
    findUnique: jest.fn(),
  },
  item: {
    findUnique: jest.fn(),
  },
  inventory: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);

    prismaMock.inventory.create.mockClear();
    prismaMock.inventory.findMany.mockClear();
    prismaMock.inventory.update.mockClear();
    prismaMock.inventory.delete.mockClear();
  });

  describe('addToInventory', () => {
    it('should create an inventory', async () => {
      const createInventoryDto = { survivorId: 1, itemId: 1, quantity: 5 };
      prismaMock.survivor.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.item.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.inventory.create.mockResolvedValue({
        ...createInventoryDto,
        id: 1,
      });

      const result = await service.addToInventory(createInventoryDto);
      expect(result).toEqual({ ...createInventoryDto, id: 1 });
      expect(prismaMock.inventory.create).toHaveBeenCalledWith({
        data: createInventoryDto,
      });
    });

    // it('should throw BadRequestException if survivor or item does not exist', async () => {
    //   const createInventoryDto = { survivorId: 1, itemId: 1, quantity: 5 };
    //   prismaMock.survivor.findUnique.mockResolvedValue(null); // Simulate survivor not found
    //   prismaMock.item.findUnique.mockResolvedValue(null); // Simulate item not found

    //   await expect(service.addToInventory(createInventoryDto)).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });
  });

  describe('findAllInventoryItems', () => {
    it('should return an array of inventory items', async () => {
      const survivorId = 1;
      const inventoryItems = [
        { id: 1, survivorId: 1, itemId: 1, quantity: 5 },
        { id: 2, survivorId: 1, itemId: 2, quantity: 10 },
      ];
      
      prismaMock.inventory.findMany.mockResolvedValue(inventoryItems);

      const result = await service.findAllInventoryItems(survivorId);
      expect(result).toEqual(inventoryItems);
      expect(prismaMock.inventory.findMany).toHaveBeenCalledWith({
        where: { survivorId },
        include: { Item: true },
      });
    });
  });
  
  describe('findInventoryItem', () => {
    it('should return an inventory item', async () => {
      const survivorId = 1;
      const itemId = 1;
      const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };
      
      prismaMock.inventory.findMany.mockResolvedValue(inventoryItem);

      const result = await service.findInventoryItem(survivorId, itemId);
      expect(result).toEqual(inventoryItem);
      expect(prismaMock.inventory.findMany).toHaveBeenCalledWith({
        where: { survivorId, itemId }
      });
    });
  });

  describe('updateInventoryItem', () => {
    it('should update an inventory item', async () => {
      const id = 1;
      const updateInventoryDto = { quantity: 10 };
      const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };

      prismaMock.inventory.findUnique.mockResolvedValue(inventoryItem);
      prismaMock.inventory.update.mockResolvedValue({
        ...inventoryItem,
        ...updateInventoryDto,
      });

      const result = await service.updateInventoryItem(id, updateInventoryDto);
      expect(result).toEqual({ ...inventoryItem, ...updateInventoryDto });
      expect(prismaMock.inventory.update).toHaveBeenCalledWith({
        where: { id: inventoryItem.id },
        data: updateInventoryDto,
      });
    });

    it('should throw NotFoundException if inventory not exists', async () => {
      prismaMock.inventory.findUnique.mockResolvedValue(null);

      await expect(
        service.updateInventoryItem(1, { quantity: 15 }),
      ).rejects.toThrow(
        new NotFoundException('Inventory item with ID 1 not found'),
      );
    });
  });

  describe('deleteInventoryItem', () => {
    it('should delete an inventory item', async () => {
      const id = 1;
      const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };

      prismaMock.inventory.findUnique.mockResolvedValue(inventoryItem);
      prismaMock.inventory.delete.mockResolvedValue(inventoryItem);

      const result = await service.deleteInventoryItem(id);
      expect(result).toEqual(inventoryItem);
      expect(prismaMock.inventory.delete).toHaveBeenCalledWith({
        where: { id: inventoryItem.id },
      });
    });

    it('should throw NotFoundException if inventory not exists', async () => {
      prismaMock.inventory.findUnique.mockResolvedValue(null);

      await expect(service.deleteInventoryItem(1)).rejects.toThrow(
        new NotFoundException('Inventory item with ID 1 not found'),
      );
    });
  });
});
