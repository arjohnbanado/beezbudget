import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrenciesService } from './currencies.service.js';
import {
  FindCurrenciesResponseDto,
  FindCurrenciesResponseSchema,
} from './schemas/find-currencies.schema.js';
import {
  ApiZodResponse,
  ApiProblemResponses,
} from '../../common/decorators/api-docs.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  @Get()
  @ApiZodResponse(FindCurrenciesResponseSchema, {
    status: 200,
    description: 'A list of selectable currencies.',
  })
  @ApiProblemResponses(401, 500)
  async findCurrencies(): Promise<FindCurrenciesResponseDto> {
    const currencies = await this.currenciesService.findCurrencies();

    return FindCurrenciesResponseSchema.parse(currencies);
  }
}
