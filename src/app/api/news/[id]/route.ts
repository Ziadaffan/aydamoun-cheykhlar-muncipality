import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NewsService } from '@/packages/news/service/news.service';
import { readImageFiles } from '@/packages/news/service/newsImage.service';
import { NewsCategory } from '@/packages/news/types/news.types';

const newsService = NewsService.instance();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const news = await newsService.getNewsById(id);

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);

    const { id } = await params;

    const result = await newsService.deleteNews(id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }

    return NextResponse.json({ message: 'News deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);

    const { id } = await params;
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

    const result = await newsService.updateNews(id, newsData, readImageFiles(formData));

    if (!result) {
      return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }

    return NextResponse.json({ message: 'News updated successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
