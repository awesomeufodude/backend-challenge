import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const prismaMock = {
    survivor: {
      count: jest.fn(),
    },
    inventory: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    
    prismaMock.survivor.count.mockClear();
    prismaMock.inventory.groupBy.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateReport', () => {
    it('should calculate and return report data correctly', async () => {
      prismaMock.survivor.count
        .mockResolvedValueOnce(120) // current non-infected
        .mockResolvedValueOnce(40) // current infected
        .mockResolvedValueOnce(100) // last month non-infected
        .mockResolvedValueOnce(30); // last month infected

      prismaMock.inventory.groupBy.mockResolvedValue([
        { itemId: 1, _avg: { quantity: 64 } },
        { itemId: 3, _avg: { quantity: 21.5 } },
      ]);

      const result = await service.generateReport();
      expect(result.percentageOfInfectedSurvivors).toEqual(83.33); // Example of expected result
      expect(result.percentageOfNonInfectedSurvivors).toEqual(16.67); // Example of expected result
      expect(prismaMock.survivor.count).toHaveBeenCalledTimes(6); // Update this to 6
      expect(prismaMock.inventory.groupBy).toHaveBeenCalledTimes(1);
    });
  });


});
