import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { DocumentService } from '@/packages/document/services/document.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const documentService = DocumentService.instance();

type DocumentIdParams = {
  documentId: string;
};

export const POST = ApiErrorHandler(async (request: Request): Promise<NextResponse> => {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const typeFile = file.name.split('.').pop();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    const documentData = {
      title,
      description,
      type: typeFile ?? '',
    };

    const result = await documentService.createDocument(base64String, documentData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const GET = ApiErrorHandler(async (request: Request): Promise<NextResponse> => {
  try {
    const documents = await documentService.getAllDocuments();
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});


