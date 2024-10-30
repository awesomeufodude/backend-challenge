import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ItemsController } from '../items/items.controller';
import { ItemsService } from '../items/items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let mockItemsService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(), // Ensure you use consistent method names as per your actual service implementation.
          },
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    mockItemsService = module.get<ItemsService>(ItemsService);
  });

  it('should update a item', async () => {
    const id = 1;
    const updateItemDto = { name: 'Updated Item' };
    const updatedItem = { id, ...updateItemDto };
    mockItemsService.update.mockResolvedValue(updatedItem);

    const result = await controller.update(id, updateItemDto);
    expect(result).toEqual(updatedItem);
    expect(mockItemsService.update).toHaveBeenCalledWith(id, updateItemDto);
  });

 it('should delete a item', async () => {
   const id = 1;
   const deletedItem = { id: 1, name: 'Item 1', description: 'Description 1' };
   mockItemsService.remove.mockResolvedValue(deletedItem);

   const result = await controller.remove(id);
   expect(result).toEqual(deletedItem);
   expect(mockItemsService.remove).toHaveBeenCalledWith(id);
 });

//  it('should throw NotFoundException if item does not exist', async () => {
//    mockItemsService.findOne.mockResolvedValue(null);

//    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
//  });

 it('should create a new item and return that', async () => {
   const itemDto = { name: 'Item 1', description: 'Description 1' };
   const createdItem = { id: 1, ...itemDto };
   mockItemsService.create.mockResolvedValue(createdItem);

   const result = await controller.create(itemDto);
   expect(result).toEqual(createdItem);
   expect(mockItemsService.create).toHaveBeenCalledWith(itemDto);
 });

 it('should return an array of items', async () => {
   const allItems = [
     { id: 1, name: 'Item 1', description: 'Description 1' },
     { id: 2, name: 'Item 2', description: 'Description 2' },
   ];
   mockItemsService.findAll.mockResolvedValue(allItems);

   expect(await controller.findAll()).toEqual(allItems);
   expect(mockItemsService.findAll).toHaveBeenCalled();
 });

 it('should return one item', async () => {
   const item = { id: 1, name: 'Item 1', description: 'Description 1' };
   mockItemsService.findOne.mockResolvedValue(item);

   expect(await controller.findOne(1)).toEqual(item);
   expect(mockItemsService.findOne).toHaveBeenCalledWith(1);

 });
});
