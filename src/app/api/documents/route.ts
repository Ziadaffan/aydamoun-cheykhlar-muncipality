import { ApiErrorHandler } from '@/packages/common/errors';
import { requireAdmin } from '@/lib/mobile-auth';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { DocumentService } from '@/packages/document/services/document.service';
import { documentFileUrl } from '@/packages/document/utils/document.utils';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const documentService = DocumentService.instance();

export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAdmin(request);

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided', code: 'FILE_REQUIRED' }, { status: 400 });
    }

    const typeFile = file.name.includes('.') ? file.name.split('.').pop() : undefined;

    const bytes = await file.arrayBuffer();
    const base64String = Buffer.from(bytes).toString('base64');

    const documentData = {
      title,
      description,
      type: typeFile ?? '',
    };

    const saved = await documentService.createDocument(base64String, documentData);
    // Same shape as before, but never echoes the file: both fields hold its web address.
    const url = documentFileUrl(new URL(request.url).origin, saved.id);
    return NextResponse.json({ document: { ...saved, fileUrl: url }, url }, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const GET = ApiErrorHandler(async (request: Request): Promise<NextResponse> => {
  try {
    const documents = await documentService.getAllDocuments(new URL(request.url).origin);
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});


