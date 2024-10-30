import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SurvivorsService } from './survivors.service';

const prismaMock = {
  survivor: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SurvivorsService', () => {
  let service: SurvivorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurvivorsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SurvivorsService>(SurvivorsService);

    prismaMock.survivor.create.mockClear();
    prismaMock.survivor.findMany.mockClear();
    prismaMock.survivor.findUnique.mockClear();
    prismaMock.survivor.update.mockClear();
    prismaMock.survivor.delete.mockClear();
  });

  describe('createSurvivor', () => {
    it('should create a survivor', async () => {
      const survivorDto = { name: 'John Doe', age: 34, gender: 'male', lastLatitude: 0, lastLongitude: 0, infected: false };
      const createdSurvivor = { id: 1, ...survivorDto };
      prismaMock.survivor.create.mockResolvedValue(createdSurvivor);

      const result = await service.create(survivorDto);
      expect(result).toEqual(createdSurvivor);
      expect(prismaMock.survivor.create).toHaveBeenCalledWith({
        data: survivorDto,
      });
    });
  });

  describe('findAllSurvivors', () => {
    it('should return all survivors', async () => {
      const allSurvivors = [{ id: 1, name: 'John Doe', age: 34 }];
      prismaMock.survivor.findMany.mockResolvedValue(allSurvivors);

      const result = await service.findAll();
      expect(result).toEqual(allSurvivors);
      expect(prismaMock.survivor.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateSurvivor', () => {
    it('should update a survivor', async () => {
      const survivorUpdate = { name: 'Updated Survivor' };
      const existingSurvivor = { id: 1, name: 'John Doe', age: 30 };

      prismaMock.survivor.findUnique.mockResolvedValue(existingSurvivor);
      prismaMock.survivor.update.mockResolvedValue({
        ...existingSurvivor,
        ...survivorUpdate,
      });

      const result = await service.update(1, survivorUpdate);
      expect(result).toEqual({ ...existingSurvivor, ...survivorUpdate });
      expect(prismaMock.survivor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: survivorUpdate,
      });
    });

    it('should throw NotFoundException if survivor not exists', async () => {
      prismaMock.survivor.findUnique.mockResolvedValue(null);

      await expect(
        service.update(1, { name: 'Updated Survivor' }),
      ).rejects.toThrow(new NotFoundException('Survivor with ID 1 not found'));
    });
  });

  describe('deleteSurvivor', () => {
    it('should delete a survivor', async () => {
      const survivorToDelete = { id: 1, name: 'John Doe', age: 30 };
      prismaMock.survivor.findUnique.mockResolvedValue(survivorToDelete);
      prismaMock.survivor.delete.mockResolvedValue(survivorToDelete);

      const result = await service.delete(1);
      expect(result).toEqual(survivorToDelete);
      expect(prismaMock.survivor.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if survivor not exists', async () => {
      prismaMock.survivor.findUnique.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(
        new NotFoundException('Survivor with ID 1 not found'),
      );
    });
  });
});
