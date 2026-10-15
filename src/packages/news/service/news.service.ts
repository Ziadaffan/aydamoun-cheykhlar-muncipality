import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { BadRequestError, NotFoundError } from '@/packages/common/errors';
import { NewsCategory as NewsCategoryEnum } from '@prisma/client';
import { NewsRepository } from '../repository/news.repository';
import { News, NewsCategory } from '../types/news.types';
import { destroyNewsImages, uploadNewsImages } from './newsImage.service';
import { v2 as cloudinary } from 'cloudinary';

type NewsInput = Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>;
type NewsQueryOptions = { summary?: boolean };

// Card fields: everything except the article body.
const NEWS_SUMMARY_SELECT = {
  id: true,
  title: true,
  excerpt: true,
  imageUrl: true,
  category: true,
  author: true,
  views: true,
  featured: true,
  tags: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} as const;

const NEWS_CATEGORIES = new Set<string>(Object.values(NewsCategoryEnum));

/** The `category` query param: missing or 'ALL' means every category, anything unknown is a 400. */
export function parseNewsCategory(value: string | null): NewsCategory | 'ALL' {
  if (!value || value === 'ALL') return 'ALL';
  if (!NEWS_CATEGORIES.has(value)) {
    throw new BadRequestError('Invalid category', 'INVALID_CATEGORY');
  }
  return value as NewsCategory;
}

/** `?summary=1` asks for card data: no `content` and only the cover image. */
export const isSummaryRequest = (searchParams: URLSearchParams): boolean => ['1', 'true'].includes(searchParams.get('summary') ?? '');

const toSummary = <T extends { imageUrl: string[] }>(news: T): T => ({ ...news, imageUrl: news.imageUrl.slice(0, 1) });

export class NewsService extends BasePrismaService<'news'> {
  private static singlenton: NewsService;

  constructor(repository: NewsRepository = new NewsRepository()) {
    super(repository);
  }

  public static instance(): NewsService {
    if (!NewsService.singlenton) {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary environment variables are missing');
      }

      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      NewsService.singlenton = new NewsService();
    }
    return NewsService.singlenton;
  }

  /** Several articles can be flagged featured (create doesn't clear the flag); the newest wins. */
  public async getFeaturedNews({ summary = false }: NewsQueryOptions = {}) {
    const news = await this.repository.findFirst({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: summary ? NEWS_SUMMARY_SELECT : undefined,
    });

    return news && summary ? toSummary(news) : news;
  }

  public async getNewsByCategory(category: NewsCategory | 'ALL', { summary = false }: NewsQueryOptions = {}) {
    const news = await this.repository.findMany({
      where: category === 'ALL' ? undefined : { category },
      orderBy: {
        createdAt: 'desc',
      },
      select: summary ? NEWS_SUMMARY_SELECT : undefined,
    });

    return summary ? news.map(toSummary) : news;
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

  public async getNewsById(id: string) {
    return await this.repository.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async deleteNews(id: string): Promise<boolean> {
    const result = await this.repository.delete({ where: { id } });

    if (!result) {
      return false;
    }

    await destroyNewsImages(result.imageUrl);

    return true;
  }

  /**
   * Uploaded images replace the article's images, as the web edit form expects.
   * An edit that sends no images keeps the current ones instead of wiping them.
   */
  public async updateNews(id: string, newsData: NewsInput, images: File[]) {
    const existing = await this.repository.findUnique({ where: { id }, select: { imageUrl: true } });

    if (!existing) {
      throw new NotFoundError('News not found');
    }

    const uploaded = images.length ? await uploadNewsImages(images) : null;

    let updated;
    try {
      if (newsData.featured) {
        await this.repository.updateMany({
          where: {
            featured: true,
          },
          data: {
            featured: false,
          },
        });
      }

      updated = await this.repository.update({
        where: { id },
        data: {
          title: newsData.title,
          content: newsData.content,
          excerpt: newsData.excerpt,
          category: newsData.category,
          author: newsData.author,
          tags: newsData.tags,
          featured: newsData.featured,
          ...(uploaded && { imageUrl: uploaded }),
        },
      });
    } catch (error) {
      console.error('Error updating news:', error);
      if (uploaded) {
        await destroyNewsImages(uploaded);
      }
      throw error;
    }

    if (uploaded) {
      await destroyNewsImages(existing.imageUrl);
    }

    return updated;
  }

  public async create(newsData: NewsInput, images: File[]) {
    const imageUrl = await uploadNewsImages(images);

    try {
      return await this.repository.create({
        data: {
          ...newsData,
          imageUrl,
          createdBy: 'ADMIN',
        },
      });
    } catch (error) {
      console.error(error);
      await destroyNewsImages(imageUrl);
      throw error;
    }
  }
}
