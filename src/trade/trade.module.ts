import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';

@Module({
  imports: [PrismaModule], // Include PrismaModule here
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
