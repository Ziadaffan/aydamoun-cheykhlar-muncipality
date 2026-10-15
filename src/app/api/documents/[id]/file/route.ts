import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { DocumentService } from '@/packages/document/services/document.service';
import {
  documentContentDisposition,
  documentMimeType,
  inlineFileBase64,
  isRemoteFileUrl,
} from '@/packages/document/utils/document.utils';

export const dynamic = 'force-dynamic';

const documentService = DocumentService.instance();

/**
 * Public download of a document's file (website, mobile app, shared links).
 * Files stored as web addresses are redirected to; uploads stored as base64
 * are decoded and served with their type and title.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const doc = await documentService.getDocumentFile(id);

    if (isRemoteFileUrl(doc.fileUrl)) {
      return NextResponse.redirect(doc.fileUrl, 302);
    }

    // A document's file never changes without its updatedAt changing.
    const etag = `"${doc.id}-${doc.updatedAt.getTime()}"`;
    const cacheHeaders = { ETag: etag, 'Cache-Control': 'public, max-age=3600' };
    if (request.headers.get('if-none-match') === etag) {
      return new NextResponse(null, { status: 304, headers: cacheHeaders });
    }

    const bytes = Buffer.from(inlineFileBase64(doc.fileUrl), 'base64');
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        ...cacheHeaders,
        'Content-Type': documentMimeType(doc.type),
        'Content-Length': String(bytes.length),
        'Content-Disposition': documentContentDisposition(doc.title, doc.type),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
