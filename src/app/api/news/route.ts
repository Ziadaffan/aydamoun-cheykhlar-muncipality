import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NewsService } from '@/packages/news/service/news.service';
import { NewsCategory } from '@/packages/news/types/news.types';

const newsService = NewsService.instance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const news = await newsService.getNewsByCategory(category as NewsCategory);

    return NextResponse.json(news);
  } catch (error) {
    returnProperErrorMessage(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as NewsCategory;
    const author = formData.get('author') as string;
    const featured = formData.get('featured') === 'true';
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];

    const images: { image: string; type: string }[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${imageFile.type};base64,${base64}`;
        images.push({ image: dataUrl, type: imageFile.type });
      }
    }

    const newsData = {
      title,
      content,
      excerpt,
      category,
      author,
      tags,
      featured,
      images,
    };

    const news = await newsService.create(newsData);

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
