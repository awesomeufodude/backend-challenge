import { IsInt } from 'class-validator';

export class ReportDto {
  totalInfectedSurvivors: number;
  totalNonInfectedSurvivors: number;
  @IsInt()
  percentageOfInfectedSurvivors: number;

  @IsInt()
  percentageOfNonInfectedSurvivors: number;
  percentageChangeHealthy: string;
  percentageChangeInfected: string;
  averageResourcesPerSurvivor: { itemId: number; quantity: number }[];
  campGrowthPercentage: string;
}
