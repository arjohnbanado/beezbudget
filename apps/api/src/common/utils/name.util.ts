import { faker } from '@faker-js/faker';

/**
 * Generates a random username.
 *
 * @returns A randomly generated username.
 *
 * @example
 * generateRandomUsername();
 * // Returns: creative_penguin42
 */
export function generateRandomUsername(): string {
  return faker.internet.username();
}
