import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { AssociationsService } from '@/packages/associations/services/associations.service';

export const dynamic = 'force-dynamic';
const associationsService = AssociationsService.instance();

export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const associations = await associationsService.getAssociations();

    return NextResponse.json(associations, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(bytes).toString('base64');

    const association = await associationsService.create(
      {
        name,
        description,
      },
      imageBase64,
      imageFile.type
    );

    return NextResponse.json(association, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
