import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class JobsRepository extends PrismaRepository<'jobs'> {
  constructor(prismaClient?: typeof prisma) {
    super('jobs', prismaClient);
  }
}
