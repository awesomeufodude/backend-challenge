import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTradeDto } from './dto/create-trade.dto';


@Injectable()
export class TradeService {
  constructor(private prisma: PrismaService) {}

  async executeTrade(createTradeDto: CreateTradeDto) {
    const { survivorId1, survivorId2, itemId1, itemId2, quantity1, quantity2 } =
      createTradeDto;

    // Validate survivors and item availability
    const [survivor1, survivor2, item1, item2] = await Promise.all([
      this.prisma.survivor.findUnique({ where: { id: survivorId1 } }),
      this.prisma.survivor.findUnique({ where: { id: survivorId2 } }),
      this.prisma.inventory.findFirst({
        where: { survivorId: survivorId1, itemId: itemId1 },
      }),
      this.prisma.inventory.findFirst({
        where: { survivorId: survivorId2, itemId: itemId2 },
      }),
    ]);

    const [survivorInventory1, survivorInventory2] = await Promise.all([
      this.prisma.inventory.findFirst({
        where: { survivorId: survivorId1, itemId: itemId2 },
      }),
      this.prisma.inventory.findFirst({
        where: { survivorId: survivorId2, itemId: itemId1 },
      }),
    ]);
    
    // Prepare transactions for trade
    const transactions = [];

    if (!survivorInventory1 ) {
      transactions.push(
        this.prisma.inventory.create({
        data: { survivorId: survivorId1, itemId: itemId2, quantity: quantity1 },
      })
      )
    } else {
      transactions.push(
        this.prisma.inventory.updateMany({
          where: { survivorId: survivorId1, itemId: itemId2 },
          data: { quantity: survivorInventory1.quantity + quantity1 },
        })
      )

    }

    if (!survivorInventory2 ) {
      transactions.push(
        this.prisma.inventory.create({
        data: { survivorId: survivorId2, itemId: itemId1, quantity: quantity2 },
      })
      )
    } else {
      transactions.push(
        this.prisma.inventory.updateMany({
          where: { survivorId: survivorId2, itemId: itemId1 },
          data: { quantity: survivorInventory2.quantity + quantity2 },
        })
      )
    }

    if (!survivor1 || !survivor2 || !item1 || !item2) {
      throw new NotFoundException(
        'Invalid trade request due to missing survivor or item.',
      );
    }

    if (item1.quantity < quantity1 || item2.quantity < quantity2) {
      throw new NotFoundException('Not enough inventory for trade.');
    }

    transactions.push(
      this.prisma.inventory.updateMany({
        where: { survivorId: survivorId1, itemId: itemId1 },
        data: { quantity: item1.quantity - quantity1 },
      }),
      this.prisma.inventory.updateMany({
        where: { survivorId: survivorId2, itemId: itemId2 },
        data: { quantity: item2.quantity - quantity2 },
      }),
      this.prisma.trade.create({ data: createTradeDto }),
    );

    // Process the trade
    await this.prisma.$transaction(transactions);

    return { message: 'Trade executed successfully.' };
  }
}
