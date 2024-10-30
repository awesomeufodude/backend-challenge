import { Module } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { SurvivorsController } from './survivors.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule], // Include PrismaModule here
  providers: [SurvivorsService],
  controllers: [SurvivorsController],
})
export class SurvivorsModule {}
