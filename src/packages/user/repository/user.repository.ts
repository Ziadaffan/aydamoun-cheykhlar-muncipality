import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class UserRepository extends PrismaRepository<'user'> {
  constructor(prismaClient?: typeof prisma) {
    super('user', prismaClient);
  }
}
