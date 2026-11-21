import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { AssociationsService, readAssociationEnglish, readAssociationImage } from '@/packages/associations/services/associations.service';

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
    await requireAdmin(request);

    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const association = await associationsService.create(
      {
        name,
        description,
        ...readAssociationEnglish(formData),
      },
      readAssociationImage(formData)
    );

    return NextResponse.json(association, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
