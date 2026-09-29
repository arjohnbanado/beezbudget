import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_BYTE_LENGTH = 32;
const IV_BYTE_LENGTH = 12;
const AUTH_TAG_BYTE_LENGTH = 16;

export interface EncryptedField {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts sensitive text with AES-256-GCM.
 *
 * Pass a 32-byte key from a secret manager or protected server configuration.
 * Never store the key alongside the encrypted value or commit it to source control.
 */
export function encryptSensitiveField(
  plaintext: string,
  encryptionKey: Buffer,
): EncryptedField {
  assertKey(encryptionKey);

  if (plaintext.length === 0) {
    throw new Error('Sensitive field must not be empty.');
  }

  const iv = randomBytes(IV_BYTE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, encryptionKey, iv, {
    authTagLength: AUTH_TAG_BYTE_LENGTH,
  });

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
  };
}

/**
 * Decrypts a value returned by encryptSensitiveField.
 * Authentication fails if the ciphertext, IV, or authentication tag was altered.
 */
export function decryptSensitiveField(
  encrypted: EncryptedField,
  encryptionKey: Buffer,
): string {
  assertKey(encryptionKey);

  const iv = decodeBase64(encrypted.iv, 'IV');
  const authTag = decodeBase64(encrypted.authTag, 'authentication tag');
  const ciphertext = decodeBase64(encrypted.ciphertext, 'ciphertext');

  if (iv.length !== IV_BYTE_LENGTH) {
    throw new Error('Invalid sensitive field IV length.');
  }

  if (authTag.length !== AUTH_TAG_BYTE_LENGTH) {
    throw new Error('Invalid sensitive field authentication tag length.');
  }

  const decipher = createDecipheriv(ALGORITHM, encryptionKey, iv, {
    authTagLength: AUTH_TAG_BYTE_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString('utf8');
}

/** Parses the base64-encoded 32-byte key configured for this application. */
export function parseSensitiveFieldEncryptionKey(
  encodedKey: string | undefined,
): Buffer {
  if (!encodedKey) {
    throw new Error('SENSITIVE_FIELD_ENCRYPTION_KEY is not configured.');
  }

  const key = decodeBase64(encodedKey, 'encryption key');
  assertKey(key);
  return key;
}

function assertKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== KEY_BYTE_LENGTH) {
    throw new Error('Sensitive field encryption key must be exactly 32 bytes.');
  }
}

function decodeBase64(value: string, field: string): Buffer {
  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      value,
    )
  ) {
    throw new Error(`Invalid base64 ${field}.`);
  }

  return Buffer.from(value, 'base64');
}
