import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class ServicesRepository extends PrismaRepository<'service'> {
  constructor(prismaClient?: typeof prisma) {
    super('service', prismaClient);
  }
}
