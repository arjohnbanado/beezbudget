import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service.js';
import { CurrenciesController } from './currencies.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
