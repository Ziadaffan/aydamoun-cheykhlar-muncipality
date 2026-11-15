import { PrismaRepository } from '@/packages/common/repository/prisma.repository';
import prisma from '@/packages/lib/db';

export class AnnouncementsRepository extends PrismaRepository<'announcement'> {
  constructor(prismaClient?: typeof prisma) {
    super('announcement', prismaClient);
  }
}
