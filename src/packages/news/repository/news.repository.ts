import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class NewsRepository extends PrismaRepository<'news'> {
  constructor(prismaClient?: typeof prisma) {
    super('news', prismaClient);
  }
}
