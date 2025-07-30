import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import { PrismaClient } from '@/packages/lib/db';

export class ServicesRepository extends PrismaRepository<'service'> {
  constructor(prismaClient?: PrismaClient) {
    super('service', prismaClient);
  }
}
