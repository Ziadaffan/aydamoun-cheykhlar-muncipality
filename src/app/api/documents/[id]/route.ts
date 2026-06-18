import { ApiErrorHandler } from '@/packages/common/errors/ApiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { DocumentService } from '@/packages/document/services/document.service';

type DocumentIdParams = {
  id: string;
};

const documentService = DocumentService.instance();

export const DELETE = ApiErrorHandler(async (request: NextRequest, context: { params: Promise<DocumentIdParams> }): Promise<NextResponse> => {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await documentService.deleteDocument(id);
    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
