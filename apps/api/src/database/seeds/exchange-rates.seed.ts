import type { PrismaService } from '../prisma/prisma.service.js';

interface FrankfurterRateItem {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export async function seedExchangeRates(prisma: PrismaService): Promise<void> {
  const existingCurrencies = await prisma.currency.findMany({
    select: { code: true },
  });
  const validCodes = new Set(existingCurrencies.map((c) => c.code));

  // Frankfurter v2 defaults to EUR as the canonical base currency covering all supported quotes
  const response = await fetch('https://api.frankfurter.dev/v2/rates');

  if (!response.ok) {
    throw new Error(
      `Failed to fetch EUR exchange rates from Frankfurter: ${response.status}`,
    );
  }

  const rates = (await response.json()) as FrankfurterRateItem[];
  const fetchedAt = new Date();

  const records = rates
    .filter(
      (item) =>
        validCodes.has(item.base) &&
        validCodes.has(item.quote) &&
        typeof item.rate === 'number' &&
        item.rate > 0,
    )
    .map((item) => ({
      baseCurrencyCode: item.base,
      quoteCurrencyCode: item.quote,
      rateDate: new Date(`${item.date}T00:00:00.000Z`),
      rate: item.rate,
      source: 'frankfurter',
      fetchedAt,
    }));

  if (records.length > 0) {
    await prisma.exchangeRate.createMany({
      data: records,
      skipDuplicates: true,
    });
  }
}
