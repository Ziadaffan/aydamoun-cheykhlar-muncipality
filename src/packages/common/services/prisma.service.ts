import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import { PrismaClient } from '@/packages/lib/db';

export abstract class BasePrismaService<K extends Exclude<keyof PrismaClient, symbol | `$${string}`>> {
  constructor(protected readonly repository: PrismaRepository<K>) {}
}
