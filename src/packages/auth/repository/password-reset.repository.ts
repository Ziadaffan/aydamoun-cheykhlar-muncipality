import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class PasswordResetRepository extends PrismaRepository<'verificationToken'> {
  constructor(prismaClient?: typeof prisma) {
    super('verificationToken', prismaClient);
  }
}
