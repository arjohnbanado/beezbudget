import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VerificationsService } from './verifications.service.js';
import {
  ApiProblemResponses,
  ApiZodResponse,
} from '../../../common/decorators/api-docs.decorator.js';
import {
  FindOneVerificationFilterSchema,
  FindOneVerificationResponseSchema,
  FindOneVerificationSchema,
} from './schemas/findOne-verification.schema.js';
import {
  CreateVerificationResponseSchema,
  CreateVerificationSchema,
} from './schemas/create-verification.schema.js';
import type {
  FindOneVerificationDto,
  FindOneVerificationFilterDto,
  FindOneVerificationResponseDto,
} from './schemas/findOne-verification.schema.js';
import type {
  CreateVerificationDto,
  CreateVerificationResponseDto,
} from './schemas/create-verification.schema.js';

@Controller('auth/verifications')
export class VerificationsController {
  constructor(private verificationsService: VerificationsService) {}

  @Get(':id')
  @ApiZodResponse(FindOneVerificationResponseSchema, { status: 200 })
  @ApiProblemResponses(400, 401, 500)
  async findOne(
    @Param({ schema: FindOneVerificationSchema })
    findOneVerificationDto: FindOneVerificationDto,
    @Query({ schema: FindOneVerificationFilterSchema })
    findOneVerificationFilterDto: FindOneVerificationFilterDto,
  ): Promise<FindOneVerificationResponseDto> {
    const verification = await this.verificationsService.findOneVerification(
      findOneVerificationDto,
      findOneVerificationFilterDto,
    );
    return FindOneVerificationResponseSchema.parse(verification);
  }

  @Post()
  @ApiZodResponse(CreateVerificationResponseSchema, {
    status: 201,
    description: 'Verification request created.',
  })
  @ApiProblemResponses(400, 409, 500)
  async create(
    @Body({ schema: CreateVerificationSchema })
    createVerificationDto: CreateVerificationDto,
  ): Promise<CreateVerificationResponseDto> {
    const verification = await this.verificationsService.createVerification(
      createVerificationDto,
    );

    return CreateVerificationResponseSchema.parse(verification);
  }

  @Post(':id/resends')
  @ApiZodResponse(CreateVerificationResponseSchema, {
    status: 201,
    description: 'Verification request resent.',
  })
  @ApiProblemResponses(400, 401, 500)
  async resend(
    @Param({ schema: FindOneVerificationSchema })
    findOneVerificationDto: FindOneVerificationDto,
  ): Promise<CreateVerificationResponseDto> {
    const verification = await this.verificationsService.resendVerification(
      findOneVerificationDto,
    );
    return CreateVerificationResponseSchema.parse(verification);
  }
}
