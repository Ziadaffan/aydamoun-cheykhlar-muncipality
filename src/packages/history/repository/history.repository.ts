import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class HistoryRepository extends PrismaRepository<'historyEntry'> {
  constructor(prismaClient?: typeof prisma) {
    super('historyEntry', prismaClient);
  }
}
