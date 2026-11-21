import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/mobile-auth';
import { ApiErrorHandler, BadRequestError } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { uploadImage } from '@/packages/common/services/image.service';
import { SERVICE_IMAGE_FOLDER } from '@/packages/services/utils/serviceFields';

export const dynamic = 'force-dynamic';

// Phone photos (HEIC from iPhones included). Vercel caps request bodies at 4.5 MB,
// so the website and the app downscale before sending.
const SERVICE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SERVICE_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * Signed in (website session or app bearer): multipart form data with one file in
 * `image`. Responds 201 { image: publicId }; the request then sends that id as the
 * value of its 'image' field.
 */
export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAuth(request);

    if (!(request.headers.get('content-type') ?? '').includes('multipart/form-data')) {
      throw new BadRequestError('Expected multipart form data', 'INVALID_IMAGE');
    }
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new BadRequestError('Invalid body', 'INVALID_IMAGE');
    }
    const file = formData.get('image');
    if (!file || typeof file === 'string' || file.size === 0) {
      throw new BadRequestError('image is required', 'INVALID_IMAGE');
    }

    const image = await uploadImage(file, SERVICE_IMAGE_FOLDER, {
      allowedTypes: SERVICE_IMAGE_TYPES,
      maxBytes: MAX_SERVICE_IMAGE_BYTES,
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
