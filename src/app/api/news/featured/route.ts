import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { NewsService, isSummaryRequest } from '@/packages/news/service/news.service';

const newsService = NewsService.instance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredNews = await newsService.getFeaturedNews({ summary: isSummaryRequest(searchParams) });

    return NextResponse.json(featuredNews);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
