import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';

describe('TradeService', () => {
  let service: TradeService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      survivor: {
        findUnique: jest.fn(),
      },
      inventory: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      trade: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeTrade', () => {
    it('should throw NotFoundException if any survivor does not exist', async () => {
      const tradeDto: CreateTradeDto = {
        survivorId1: 1,
        survivorId2: 2,
        itemId1: 3,
        itemId2: 4,
        quantity1: 5,
        quantity2: 6,
      };
      prismaMock.survivor.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.executeTrade(tradeDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMock.survivor.findUnique).toHaveBeenCalledTimes(2);
    });

    it('should execute a trade successfully when all conditions are met', async () => {
      const tradeDto: CreateTradeDto = {
        survivorId1: 1,
        survivorId2: 2,
        itemId1: 3,
        itemId2: 4,
        quantity1: 5,
        quantity2: 6,
      };
      prismaMock.survivor.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.inventory.findFirst.mockResolvedValue({
        itemId: 3,
        quantity: 10,
      });
      prismaMock.$transaction.mockResolvedValue('Transaction successful');

      const result = await service.executeTrade(tradeDto);

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Trade executed successfully.' });
    });
  });

});
