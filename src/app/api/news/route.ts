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
