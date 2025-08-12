import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { NewsRepository } from '../repository/news.repository';
import { NewsCategory } from '../types/news.types';

export class NewsService extends BasePrismaService<'news'> {
  private static singlenton: NewsService;

  constructor(repository: NewsRepository = new NewsRepository('news')) {
    super(repository);
  }

  public static getInstance(): NewsService {
    if (!NewsService.singlenton) {
      NewsService.singlenton = new NewsService();
    }
    return NewsService.singlenton;
  }

  public async getFeaturedNews() {
    return this.repository.findFirst({
      where: {
        featured: true,
      },
    });
  }

  public async getNewsByCategory(category: NewsCategory) {
    return await this.repository.findMany({
      where: {
        category: category,
      },
    });
  }

  public async getNewsCategories() {
    return await this.repository.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });
  }
}
