import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class ServiceSubmissionRepository extends PrismaRepository<'serviceSubmission'> {
  constructor(prismaClient?: typeof prisma) {
    super('serviceSubmission', prismaClient);
  }
}
