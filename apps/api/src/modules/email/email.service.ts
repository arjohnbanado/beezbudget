import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';
import {
  SendEmailVerification,
  SendPasswordReset,
} from './interfaces/email.interface';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class EmailService {
  private resend: Resend;

  private readonly frontendUrl: string;
  private readonly template: string;
  private readonly passwordResetTemplate: string;
  private readonly resendKey: string | undefined;

  constructor(private configService: ConfigService) {
    this.resendKey = this.configService.get<string | undefined>(
      'RESEND_API_KEY',
    );
    this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    this.resend = new Resend(this.resendKey);

    const templatePath = join(
      process.cwd(),
      'src/modules/email/templates/email-verification.html',
    );

    this.template = readFileSync(templatePath, 'utf-8');

    const passwordResetTemplatePath = join(
      process.cwd(),
      'src/modules/email/templates/password-reset.html',
    );

    this.passwordResetTemplate = readFileSync(
      passwordResetTemplatePath,
      'utf-8',
    );
  }

  async sendEmail(options: CreateEmailOptions) {
    await this.resend.emails.send(options);
  }
  async sendEmailVerification(data: SendEmailVerification) {
    const { email, rawToken, verificationId } = data;

    const html = this.template
      .replaceAll(
        '{{VERIFICATION_URL}}',
        `${this.frontendUrl}/signup/setup?t=${rawToken}&verificationId=${verificationId}`,
      )
      .replaceAll('{{EXPIRATION}}', '15 minutes')
      .replaceAll('{{YEAR}}', new Date().getFullYear().toString());

    await this.sendEmail({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address for BeezBudget',
      html,
    });
  }

  async sendPasswordReset(data: SendPasswordReset) {
    const { email, rawToken, verificationId } = data;

    const html = this.passwordResetTemplate
      .replaceAll(
        '{{RESET_URL}}',
        `${this.frontendUrl}/forgot-password/setup?t=${rawToken}&verificationId=${verificationId}`,
      )
      .replaceAll('{{EXPIRATION}}', '15 minutes')
      .replaceAll('{{YEAR}}', new Date().getFullYear().toString());

    await this.sendEmail({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your BeezBudget password',
      html,
    });
  }
}
