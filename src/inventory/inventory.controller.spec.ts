import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockInventoryService = {
  addToInventory: jest.fn(),
  findAllInventoryItems: jest.fn(),
  findInventoryItem: jest.fn(),
  updateInventoryItem: jest.fn(),
  deleteInventoryItem: jest.fn(),
};

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);

    jest.clearAllMocks();
  });

  it('should update a inventory item', async () => {
    const id = 1;
    const updateInventoryDto = { quantity: 10 };
    const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };
    mockInventoryService.updateInventoryItem.mockResolvedValue(inventoryItem);
    const result = await controller.updateInventoryItem(id, updateInventoryDto);
    expect(result).toEqual(inventoryItem);
    expect(mockInventoryService.updateInventoryItem).toHaveBeenCalledWith(id, updateInventoryDto);
  });

  it('should delete an inventory item', async () => {
    const id = 1;
    const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };
    mockInventoryService.deleteInventoryItem.mockResolvedValue(inventoryItem);
    const result = await controller.deleteInventoryItem(id);
    expect(result).toEqual(inventoryItem);
    expect(mockInventoryService.deleteInventoryItem).toHaveBeenCalledWith(id);
  });

  it('should get all inventory items', async () => {
    const survivorId = 1;
    const inventoryItems = [
      { id: 1, survivorId: 1, itemId: 1, quantity: 5 },
      { id: 2, survivorId: 1, itemId: 2, quantity: 10 },
    ];
    mockInventoryService.findAllInventoryItems.mockResolvedValue(inventoryItems);
    const result = await controller.findAllInventoryItems(survivorId);
    expect(result).toEqual(inventoryItems);
    expect(mockInventoryService.findAllInventoryItems).toHaveBeenCalledWith(survivorId);
  });

  it('should get an inventory item', async () => {
    const survivorId = 1;
    const itemId = 1;
    const inventoryItem = { id: 1, survivorId: 1, itemId: 1, quantity: 5 };
    mockInventoryService.findInventoryItem.mockResolvedValue(inventoryItem);
    const result = await controller.findInventoryItem(survivorId, itemId);
    expect(result).toEqual(inventoryItem);
    expect(mockInventoryService.findInventoryItem).toHaveBeenCalledWith(survivorId, itemId);
  });

  it('should create an inventory item', async () => {
    const createInventoryDto = { survivorId: 1, itemId: 1, quantity: 5 };
    mockInventoryService.addToInventory.mockResolvedValue(createInventoryDto);
    const result = await controller.addToInventory(createInventoryDto);
    expect(result).toEqual(createInventoryDto);
    expect(mockInventoryService.addToInventory).toHaveBeenCalledWith(createInventoryDto);
  });
});
