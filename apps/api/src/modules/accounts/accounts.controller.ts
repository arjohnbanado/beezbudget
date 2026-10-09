import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AccountsService } from './accounts.service.js';
import {
  FindAccountTypesResponseDto,
  FindAccountTypesResponseSchema,
} from './schemas/find-account-types.schema.js';
import {
  CreateAccountTypeSchema,
} from './schemas/create-account-type.schema.js';
import type {
  CreateAccountTypeDto,
} from './schemas/create-account-type.schema.js';
import {
  CreateAccountSchema,
} from './schemas/create-account.schema.js';
import type {
  CreateAccountDto,
} from './schemas/create-account.schema.js';
import {
  ApiProblemResponses,
} from '../../common/decorators/api-docs.decorator.js';
import { ApiCreatedResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('types')
  async findAccountTypes(
    @Request() req: any,
  ): Promise<FindAccountTypesResponseDto> {
    const accountTypes = await this.accountsService.findAccountTypes(req.user);

    return FindAccountTypesResponseSchema.parse(accountTypes);
  }

  @Post('types')
  @ApiCreatedResponse({
    description: 'Account type created successfully.',
  })
  @ApiProblemResponses(400, 401, 500)
  async createAccountType(
    @Request() req: any,
    @Body({ schema: CreateAccountTypeSchema })
    createAccountTypeDto: CreateAccountTypeDto,
  ): Promise<void> {
    await this.accountsService.createAccountType(
      req.user,
      createAccountTypeDto,
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Account created successfully.',
  })
  @ApiProblemResponses(400, 401, 500)
  async createAccount(
    @Request() req: any,
    @Body({ schema: CreateAccountSchema })
    createAccountDto: CreateAccountDto,
  ) {
    return await this.accountsService.createAccount(req.user, createAccountDto);
  }
}

