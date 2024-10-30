import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async executeTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradeService.executeTrade(createTradeDto);
  }
}
