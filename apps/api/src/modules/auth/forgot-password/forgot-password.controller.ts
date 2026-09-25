import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service.js';
import {
  ApiProblemResponses,
  ApiZodResponse,
} from '../../../common/decorators/api-docs.decorator.js';
import {
  CreateForgotPasswordResponseSchema,
  CreateForgotPasswordSchema,
} from './schemas/create-forgot-password.schema.js';
import type {
  CreateForgotPasswordDto,
  CreateForgotPasswordResponseDto,
} from './schemas/create-forgot-password.schema.js';
import {
  FindOneForgotPasswordFilterSchema,
  FindOneForgotPasswordResponseSchema,
  FindOneForgotPasswordSchema,
} from './schemas/findOne-forgot-password.schema.js';
import type {
  FindOneForgotPasswordDto,
  FindOneForgotPasswordFilterDto,
  FindOneForgotPasswordResponseDto,
} from './schemas/findOne-forgot-password.schema.js';

@Controller('auth/forgot-password')
export class ForgotPasswordController {
  constructor(private forgotPasswordService: ForgotPasswordService) {}

  @Get(':id')
  @ApiZodResponse(FindOneForgotPasswordResponseSchema, { status: 200 })
  @ApiProblemResponses(400, 401, 500)
  async findOne(
    @Param({ schema: FindOneForgotPasswordSchema })
    findOneForgotPasswordDto: FindOneForgotPasswordDto,
    @Query({ schema: FindOneForgotPasswordFilterSchema })
    findOneForgotPasswordFilterDto: FindOneForgotPasswordFilterDto,
  ): Promise<FindOneForgotPasswordResponseDto> {
    const token = await this.forgotPasswordService.findOneForgotPassword(
      findOneForgotPasswordDto,
      findOneForgotPasswordFilterDto,
    );

    return FindOneForgotPasswordResponseSchema.parse(token);
  }

  @Post()
  @ApiZodResponse(CreateForgotPasswordResponseSchema, {
    status: 201,
    description: 'Password-reset request created.',
  })
  @ApiProblemResponses(400, 401, 500)
  async create(
    @Body({ schema: CreateForgotPasswordSchema })
    createForgotPasswordDto: CreateForgotPasswordDto,
  ): Promise<CreateForgotPasswordResponseDto> {
    const token = await this.forgotPasswordService.createForgotPassword(
      createForgotPasswordDto,
    );

    return CreateForgotPasswordResponseSchema.parse(token);
  }

  @Post(':id/resends')
  @ApiZodResponse(CreateForgotPasswordResponseSchema, {
    status: 201,
    description: 'Password-reset request resent.',
  })
  @ApiProblemResponses(400, 401, 500)
  async resend(
    @Param({ schema: FindOneForgotPasswordSchema })
    findOneForgotPasswordDto: FindOneForgotPasswordDto,
  ): Promise<CreateForgotPasswordResponseDto> {
    const token = await this.forgotPasswordService.resendForgotPassword(
      findOneForgotPasswordDto,
    );

    return CreateForgotPasswordResponseSchema.parse(token);
  }
}
