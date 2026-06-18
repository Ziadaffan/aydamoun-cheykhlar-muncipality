import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class AssociationsRepository extends PrismaRepository<'association'> {
  constructor(prismaClient?: typeof prisma) {
    super('association', prismaClient);
  }
}
