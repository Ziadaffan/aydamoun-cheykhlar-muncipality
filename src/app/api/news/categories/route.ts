import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/packages/news/service/news.service';

const newsService = NewsService.instance();

export async function GET(request: NextRequest) {
  try {
    const newsCategories = await newsService.getNewsCategories();

    return NextResponse.json(newsCategories);
  } catch (error) {
    returnProperErrorMessage(error);
  }
}
