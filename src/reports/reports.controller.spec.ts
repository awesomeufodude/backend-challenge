import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            generateReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReports', () => {
    it('should return report data', async () => {
      const expectedData: ReportDto = {
        totalInfectedSurvivors: 100,
        totalNonInfectedSurvivors: 200,
        percentageOfInfectedSurvivors: 25,
        percentageOfNonInfectedSurvivors: 75,
        averageResourcesPerSurvivor: [
          { itemId: 1, quantity: 50 },
          { itemId: 3, quantity: 20 },
        ],
        percentageChangeHealthy: '+5%',
        percentageChangeInfected: '-3%',
        campGrowthPercentage: '+2%',
      };

      jest
        .spyOn(reportsService, 'generateReport')
        .mockResolvedValue(expectedData);

      const result = await controller.getReports();
      expect(result).toEqual(expectedData);
      expect(reportsService.generateReport).toHaveBeenCalledTimes(1);
    });
  });

});
