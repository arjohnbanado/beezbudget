import type { PrismaService } from '../prisma/prisma.service.js';

const builtInAccountTypes = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Cash',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Bank',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'E-wallet',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    name: 'Card',
  },
] as const;

export async function seedAccountTypes(prisma: PrismaService): Promise<void> {
  for (const accountType of builtInAccountTypes) {
    await prisma.accountType.upsert({
      where: { id: accountType.id },
      create: {
        id: accountType.id,
        userId: null,
        name: accountType.name,
      },
      update: {
        userId: null,
        name: accountType.name,
      },
    });
  }
}
