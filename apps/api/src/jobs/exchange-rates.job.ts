import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma/prisma.service.js';
import { seedExchangeRates } from '../database/seeds/exchange-rates.seed.js';

@Injectable()
export class ExchangeRatesJob {
  private readonly logger = new Logger(ExchangeRatesJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleExchangeRatesSync(): Promise<void> {
    this.logger.log(
      'Starting scheduled exchange rates sync (every 12 hours)...',
    );

    try {
      await seedExchangeRates(this.prisma);
      this.logger.log('Exchange rates sync completed successfully.');
    } catch (error) {
      this.logger.error(
        'Exchange rates sync failed; will retry on the next 12-hour cycle.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
