import { PrismaRepository } from '@/packages/common/repository/prisma.repository';

export class NewsRepository extends PrismaRepository<'news'> {
  constructor(model: 'news') {
    super(model);
  }
}
