import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TradeController', () => {
  let controller: TradeController;
  let tradeService: TradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [
        {
          provide: TradeService,
          useValue: {
            executeTrade: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TradeController>(TradeController);
    tradeService = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

 describe('executeTrade', () => {
   it('should successfully execute a trade and return a result', async () => {
     const tradeDto: CreateTradeDto = {
       survivorId1: 1,
       survivorId2: 2,
       itemId1: 1,
       itemId2: 2,
       quantity1: 5,
       quantity2: 10,
     };
     const expectedResult = { message: 'Trade executed successfully.' };

     jest.spyOn(tradeService, 'executeTrade').mockResolvedValue(expectedResult);

     const result = await controller.executeTrade(tradeDto);
     expect(result).toEqual(expectedResult);
     expect(tradeService.executeTrade).toHaveBeenCalledWith(tradeDto);
   });

   it('should handle exceptions thrown by the service', async () => {
     const tradeDto: CreateTradeDto = {
       survivorId1: 1,
       survivorId2: 2,
       itemId1: 1,
       itemId2: 2,
       quantity1: 5,
       quantity2: 10,
     };
     const errorMessage = 'Invalid trade request';
     jest
       .spyOn(tradeService, 'executeTrade')
       .mockRejectedValue(
         new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
       );

     try {
       await controller.executeTrade(tradeDto);
     } catch (error) {
       expect(error.status).toBe(HttpStatus.BAD_REQUEST);
       expect(error.response).toBe(errorMessage);
     }
   });
 });

});
