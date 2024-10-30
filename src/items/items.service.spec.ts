import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ItemsService } from './items.service';

const prismaMock = {
  item: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);

    // Clear all mocks to ensure clean state in each test
    prismaMock.item.create.mockClear();
    prismaMock.item.findMany.mockClear();
    prismaMock.item.findUnique.mockClear();
    prismaMock.item.update.mockClear();
    prismaMock.item.delete.mockClear();
  });

    describe('createItem', () => {
      it('should create an item', async () => {
        const itemDto = {
          name: 'Water',
          description: 'Essential for hydration',
        };
        const createdItem = { id: 1, ...itemDto };
        prismaMock.item.create.mockResolvedValue(createdItem);

        const result = await service.create(itemDto);
        expect(result).toEqual(createdItem);
        expect(prismaMock.item.create).toHaveBeenCalledWith({
          data: itemDto,
        });
      });
    });

      describe('findAllItems', () => {
        it('should return all items', async () => {
          const allItems = [
            { id: 1, name: 'Water', description: 'Essential for hydration' },
          ];
          prismaMock.item.findMany.mockResolvedValue(allItems);

          const result = await service.findAll();
          expect(result).toEqual(allItems);
          expect(prismaMock.item.findMany).toHaveBeenCalledTimes(1);
        });
      });


        describe('updateItem', () => {
          it('should update an item', async () => {
            const itemUpdate = { name: 'Filtered Water' };
            const existingItem = {
              id: 1,
              name: 'Water',
              description: 'Essential for hydration',
            };

            prismaMock.item.findUnique.mockResolvedValue(existingItem.id);
            prismaMock.item.update.mockResolvedValue({
              ...existingItem,
              ...itemUpdate,
            });

            const result = await service.update(1, itemUpdate);
            expect(result).toEqual({ ...existingItem, ...itemUpdate });
            expect(prismaMock.item.update).toHaveBeenCalledWith({
              where: { id: 1 },
              data: itemUpdate,
            });
          });

          //  it('should throw NotFoundException if item not exists', async () => {
          //    prismaMock.item.findUnique.mockResolvedValue(null);

          //    await expect(
          //      service.update(1, { name: 'Filtered Water' }),
          //    ).rejects.toThrow(
          //      new NotFoundException('Survivor with ID 1 not found'),
          //    );
          //  });
        });


          describe('deleteItem', () => {
            it('should delete an item', async () => {
              const itemToDelete = {
                id: 1,
                name: 'Water',
                description: 'Essential for hydration',
              };
              prismaMock.item.findUnique.mockResolvedValue(itemToDelete);
              prismaMock.item.delete.mockResolvedValue(itemToDelete);

              const result = await service.remove(1);
              expect(result).toEqual(itemToDelete);
              expect(prismaMock.item.delete).toHaveBeenCalledWith({
                where: { id: 1 },
              });
            });

            // it('should throw NotFoundException if item not exists', async () => {
            //   prismaMock.item.findUnique.mockResolvedValue(null);

            //   await expect(service.remove(1)).rejects.toThrow(
            //     new NotFoundException('Item with ID 1 not found'),
            //   );
            // });
          });


});
