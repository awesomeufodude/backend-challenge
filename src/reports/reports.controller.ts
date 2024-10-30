import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async getReports(): Promise<ReportDto> {
    return this.reportsService.generateReport();
  }
}
