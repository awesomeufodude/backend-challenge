import { Test, TestingModule } from '@nestjs/testing';
import { SurvivorsController } from './survivors.controller';
import { SurvivorsService } from './survivors.service';
import { NotFoundException } from '@nestjs/common';

describe('SurvivorsController', () => {
  let controller: SurvivorsController;
  let mockSurvivorsService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurvivorsController],
      providers: [
        {
          provide: SurvivorsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(), // Ensure you use consistent method names as per your actual service implementation.
          },
        },
      ],
    }).compile();

    controller = module.get<SurvivorsController>(SurvivorsController);
    mockSurvivorsService = module.get<SurvivorsService>(SurvivorsService);
  });

  it('should update a survivor', async () => {
    const survivorId = 1;
    const updateDto = { name: 'Updated Name' };
    const existingSurvivor = { id: survivorId, name: 'John Doe', age: 30, infected: false, gender: 'male', lastLatitude: 0, lastLongitude: 0 };

    mockSurvivorsService.findOne.mockResolvedValue(existingSurvivor);
    mockSurvivorsService.update.mockResolvedValue({
      ...existingSurvivor,
      ...updateDto,
    });

    await expect(controller.update(survivorId, updateDto)).resolves.toEqual({
      ...existingSurvivor,
      ...updateDto,
    });
    expect(mockSurvivorsService.findOne).toHaveBeenCalledWith(survivorId);
    expect(mockSurvivorsService.update).toHaveBeenCalledWith(
      survivorId,
      updateDto,
    );
  });

  it('should delete a survivor', async () => {
    const survivorId = 1;
    const existingSurvivor = { id: survivorId, name: 'John Doe', age: 30, infected: false, gender: 'male', lastLatitude: 0, lastLongitude: 0 };

    mockSurvivorsService.findOne.mockResolvedValue(existingSurvivor);
    mockSurvivorsService.delete.mockResolvedValue(existingSurvivor); // Use 'delete' or 'remove' based on your actual service code

    await expect(controller.delete(survivorId)).resolves.toEqual(
      existingSurvivor,
    );
    expect(mockSurvivorsService.findOne).toHaveBeenCalledWith(survivorId);
    expect(mockSurvivorsService.delete).toHaveBeenCalledWith(survivorId); // Ensure this matches the actual method name
  });

  it('should throw NotFoundException if survivor does not exist', async () => {
    mockSurvivorsService.findOne.mockResolvedValue(null);

    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a new survivor and return that', async () => {
    const survivorDto = { name: 'John Doe', age: 34, gender: 'male', lastLatitude: 0, lastLongitude: 0, infected: false };
    const createdSurvivor = { id: 1, ...survivorDto };
    mockSurvivorsService.create.mockResolvedValue(createdSurvivor);

    expect(await controller.create(survivorDto)).toEqual(createdSurvivor);
    expect(mockSurvivorsService.create).toHaveBeenCalledWith(survivorDto);
  });

  it('should return an array of survivors', async () => {
    const allSurvivors = [{ id: 1, name: 'John Doe', age: 34, gender: 'male', lastLatitude: 0, lastLongitude: 0, infected: false }];
    mockSurvivorsService.findAll.mockResolvedValue(allSurvivors);

    expect(await controller.getAllSurvivors()).toEqual(allSurvivors);
    expect(mockSurvivorsService.findAll).toHaveBeenCalled();
  });

  it('should return one survivor', async () => {
    const survivor = { id: 1, name: 'John Doe', age: 34, gender: 'male', lastLatitude: 0, lastLongitude: 0, infected: false };
    mockSurvivorsService.findOne.mockResolvedValue(survivor);

    expect(await controller.findOne(1)).toEqual(survivor);
    expect(mockSurvivorsService.findOne).toHaveBeenCalledWith(1);
  });


});
 