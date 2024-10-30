import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurvivorsModule } from './survivors/survivors.module';
import { ItemsModule } from './items/items.module';
import { InventoryModule } from './inventory/inventory.module';
import { TradeModule } from './trade/trade.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SurvivorsModule, ItemsModule, InventoryModule, TradeModule, ReportsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
