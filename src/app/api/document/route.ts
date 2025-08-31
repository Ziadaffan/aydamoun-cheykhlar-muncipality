import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { DocumentService } from '@/packages/document/services/document.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const documentService = DocumentService.instance();

export const POST = ApiErrorHandler(async (request: Request): Promise<NextResponse> => {
  try {
    const data = await request.json();

    if (!data.file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await data.file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${data.file.type};base64,${buffer.toString('base64')}`;

    const fileUrl = await documentService.createDocument(base64String, data);
    return NextResponse.json(fileUrl, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
