import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { NewsRepository } from '../repository/news.repository';
import { NewsCategory } from '../types/news.types';

export class NewsService extends BasePrismaService<'news'> {
  private static singlenton: NewsService;

  constructor(repository: NewsRepository = new NewsRepository('news')) {
    super(repository);
  }

  public static instance(): NewsService {
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
      include: {
        tags: true,
      },
    });
  }

  public async getNewsByCategory(category: NewsCategory | 'ALL') {
    if (category === 'ALL') {
      return await this.repository.findMany({
        include: {
          tags: true,
        },
      });
    }

    return await this.repository.findMany({
      where: {
        category: category,
      },
      include: {
        tags: true,
      },
    });
  }

  public async getNewsCategories() {
    const results = await this.repository.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return results.map(result => result.category);
  }
}
