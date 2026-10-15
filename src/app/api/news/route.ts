import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NewsService, isSummaryRequest, parseNewsCategory } from '@/packages/news/service/news.service';
import { readImageFiles } from '@/packages/news/service/newsImage.service';
import { NewsCategory } from '@/packages/news/types/news.types';

const newsService = NewsService.instance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = parseNewsCategory(searchParams.get('category'));

    const news = await newsService.getNewsByCategory(category, { summary: isSummaryRequest(searchParams) });

    return NextResponse.json(news);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as NewsCategory;
    const author = formData.get('author') as string;
    const featured = formData.get('featured') === 'true';
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];

    const newsData = {
      title,
      content,
      excerpt,
      category,
      author,
      tags,
      featured,
    };

    const news = await newsService.create(newsData, readImageFiles(formData));

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
