import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import {
  FindMeResponseSchema,
  type FindMeResponseDto,
} from './schemas/find-me.schema.js';
import {
  CompleteOnboardingSchema,
  type CompleteOnboardingDto,
} from './schemas/complete-onboarding.schema.js';
import {
  ApiProblemResponses,
  ApiZodResponse,
} from '../../common/decorators/api-docs.decorator.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiZodResponse(FindMeResponseSchema, {
    status: 200,
    description: 'Current authenticated user profile.',
  })
  @ApiProblemResponses(401, 500)
  async findMe(@Request() req: any): Promise<FindMeResponseDto> {
    const me = await this.usersService.findMe(req.user.userId);

    return FindMeResponseSchema.parse(me);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/onboarding')
  @ApiZodResponse(FindMeResponseSchema, {
    status: 200,
    description:
      'Completes user onboarding and re-issues an updated access token cookie.',
  })
  @ApiProblemResponses(400, 401, 500)
  async completeOnboarding(
    @Request() req: any,
    @Body({ schema: CompleteOnboardingSchema })
    completeOnboardingDto: CompleteOnboardingDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<FindMeResponseDto> {
    const updatedUser = await this.usersService.completeOnboarding(
      req.user.userId,
      completeOnboardingDto,
    );

    const tokenData = this.authService.issueAccessTokenForUser(updatedUser);

    res.cookie('__Host-access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: tokenData.rTCookieMaxAge,
    });

    return FindMeResponseSchema.parse({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      preferred_currency_code: updatedUser.preferredCurrencyCode,
      is_onboarded: Boolean(updatedUser.onboardedAt),
    });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
