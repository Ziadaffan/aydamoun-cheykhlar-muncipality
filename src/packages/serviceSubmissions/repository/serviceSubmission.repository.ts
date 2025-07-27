import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import { PrismaClient } from '@/packages/lib/db';

export class ServiceSubmissionRepository extends PrismaRepository<'serviceSubmission'> {
  constructor(prismaClient?: PrismaClient) {
    super('serviceSubmission', prismaClient);
  }
}
