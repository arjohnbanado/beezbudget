import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { seedCurrencies } from './currencies.seed.js';
import { seedExchangeRates } from './exchange-rates.seed.js';

async function main(): Promise<void> {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();
    await seedCurrencies(prisma);
    await seedExchangeRates(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
