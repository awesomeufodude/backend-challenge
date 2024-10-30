import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(): Promise<ReportDto> {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );

    const [currentSurvivors, lastMonthSurvivors] = await Promise.all([
      this.getSurvivorStats(),
      this.getSurvivorStats(lastMonth),
    ]);

    const currentTotal = currentSurvivors.total;
    const lastMonthTotal = lastMonthSurvivors.total;

    const campGrowthPercentage = this.calculatePercentageChange(
      lastMonthSurvivors.total,
      currentSurvivors.total,
    );

    const infectedSurvivor = await this.prisma.survivor.count({
      where: { infected: true },
    });
    const healthySurvivor = await this.prisma.survivor.count({
      where: { infected: false },
    });

    return {
      totalInfectedSurvivors: infectedSurvivor,
      totalNonInfectedSurvivors: healthySurvivor,
      percentageOfInfectedSurvivors: Number(
        ((currentSurvivors.infected / currentTotal) * 100).toFixed(2),
      ),
      percentageOfNonInfectedSurvivors: Number(
        (
          ((currentTotal - currentSurvivors.infected) / currentTotal) *
          100
        ).toFixed(2),
      ),
      percentageChangeHealthy: this.calculatePercentageChange(
        lastMonthSurvivors.nonInfected,
        currentSurvivors.nonInfected,
      ),
      percentageChangeInfected: this.calculatePercentageChange(
        lastMonthSurvivors.infected,
        currentSurvivors.infected,
      ),
      averageResourcesPerSurvivor: await this.calculateResourceAllocation(),
      campGrowthPercentage: campGrowthPercentage,
    };
  }

  private async getSurvivorStats(date?: Date) {
    const condition = date ? { createdAt: { lt: date } } : {};
    const total = await this.prisma.survivor.count({ where: condition });
    const infected = await this.prisma.survivor.count({
      where: { ...condition, infected: true },
    });
    return { total, infected, nonInfected: total - infected };
  }

  private calculatePercentageChange(
    oldNumber: number,
    newNumber: number,
  ): string {
    if (oldNumber === 0) {
      if (newNumber === 0) {
        return '0%';
      } else {
        return newNumber > 0 ? '+∞%' : '-∞%';
      }
    }

    const increase = newNumber - oldNumber;
    const percentageChange = (increase / oldNumber) * 100;
    return (
      (percentageChange > 0 ? '+' : '') + percentageChange.toFixed(2) + '%'
    );
  }

  private async calculateResourceAllocation(): Promise<
    { itemId: number; quantity: number }[]
  > {
    const resources = await this.prisma.inventory.groupBy({
      by: ['itemId'],
      _avg: {
        quantity: true,
      },
    });

    return resources.map((resource) => ({
      itemId: resource.itemId,
      quantity: resource._avg.quantity ?? 0,
    }));
  }
}
