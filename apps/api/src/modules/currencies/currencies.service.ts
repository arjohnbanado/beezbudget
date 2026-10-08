import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async findCurrencies() {
    return this.prisma.currency.findMany({
      where: {
        isSelectable: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
