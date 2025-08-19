import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class AboutUsRepository extends PrismaRepository<'council'> {
  constructor(prismaClient?: typeof prisma) {
    super('council', prismaClient);
  }
}
