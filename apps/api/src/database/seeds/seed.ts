import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { seedAccountTypes } from './account-types.seed.js';
import { seedCurrencies } from './currencies.seed.js';

async function main(): Promise<void> {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();
    await seedCurrencies(prisma);
    await seedAccountTypes(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
