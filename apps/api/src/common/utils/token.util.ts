import { createHash, randomBytes } from 'node:crypto';

export interface GeneratedToken {
  rawToken: string;
  tokenHash: string;
}

export function generateSecureToken(): GeneratedToken {
  const rawToken = randomBytes(32).toString('hex');

  const tokenHash = createHash('sha256').update(rawToken).digest('hex');

  return {
    rawToken,
    tokenHash,
  };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
