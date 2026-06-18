import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class DocumentRepository extends PrismaRepository<'document'> {
  constructor(prismaClient?: typeof prisma) {
    super('document', prismaClient);
  }
}
