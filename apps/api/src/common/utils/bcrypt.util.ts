import bcrypt from 'bcrypt';

export const BCRYPT_SALT_ROUNDS = 12;

export function hashPassword(
  password: string,
  saltRounds = BCRYPT_SALT_ROUNDS,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
