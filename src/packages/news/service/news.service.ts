import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { NewsRepository } from '../repository/news.repository';
import { News, NewsCategory } from '../types/news.types';
import { getResourceType } from '@/packages/document/utils/document.utils';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

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

  public async getFeaturedNews() {
    return this.repository.findFirst({
      where: {
        featured: true,
      },
    });
  }

  public async getNewsByCategory(category: NewsCategory | 'ALL') {
    if (category === 'ALL') {
      return await this.repository.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return await this.repository.findMany({
      where: {
        category: category,
      },
      orderBy: {
        createdAt: 'desc',
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

    for (const imageUrl of result.imageUrl) {
      await cloudinary.uploader.destroy(imageUrl, { resource_type: 'image' });
    }

    return true;
  }

  public async updateNews(
    id: string,
    newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> & { images: { image: string; type: string }[] }
  ) {
    try {
      const imageUrls: string[] = [];

      for (const image of Object.values(newsData.images)) {
        const type = image.type.split('/').pop() || 'png';
        const resourceType = getResourceType(type);
        const uploadResult = await cloudinary.uploader.upload(image.image, {
          public_id: uuidv4(),
          resource_type: resourceType,
          format: type,
        });
        imageUrls.push(uploadResult.public_id);
      }

      const newsToUpdate = {
        title: newsData.title,
        content: newsData.content,
        excerpt: newsData.excerpt,
        category: newsData.category,
        author: newsData.author,
        tags: newsData.tags,
        featured: newsData.featured,
        imageUrl: imageUrls,
      };

      return await this.repository.update({
        where: { id },
        data: newsToUpdate,
      });
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  public async create(newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> & { images: { image: string; type: string }[] }) {
    try {
      const imageUrls: string[] = [];

      for (const image of Object.values(newsData.images)) {
        const type = image.type.split('/').pop() || 'png';
        const resourceType = getResourceType(type);
        const uploadResult = await cloudinary.uploader.upload(image.image, {
          public_id: uuidv4(),
          resource_type: resourceType,
          format: type,
        });
        imageUrls.push(uploadResult.public_id);
      }

      const { images, ...newsDataWithoutImages } = newsData;

      const news = await this.repository.create({
        data: {
          ...newsDataWithoutImages,
          createdBy: 'ADMIN',
          imageUrl: imageUrls,
        },
      });

      return news;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
