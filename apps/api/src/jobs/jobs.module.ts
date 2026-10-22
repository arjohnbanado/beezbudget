import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeRatesJob } from './exchange-rates.job.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ExchangeRatesJob],
})
export class JobsModule {}
