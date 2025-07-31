import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import { PrismaClient } from '@/packages/lib/db';

export class AuthRepository extends PrismaRepository<'user'> {
  constructor(prismaClient?: PrismaClient) {
    super('user', prismaClient);
  }
}
