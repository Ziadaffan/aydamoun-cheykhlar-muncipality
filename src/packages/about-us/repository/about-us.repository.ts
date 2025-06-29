import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import { PrismaClient } from '@/packages/lib/db';

export class AboutUsRepository extends PrismaRepository<'council'> {
  constructor(prismaClient?: PrismaClient) {
    super('council', prismaClient);
  }
}
