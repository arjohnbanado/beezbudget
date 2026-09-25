export interface SendEmailVerification {
  email: string;
  rawToken: string;
  verificationId: string;
}

export interface SendPasswordReset {
  email: string;
  rawToken: string;
  verificationId: string;
}
