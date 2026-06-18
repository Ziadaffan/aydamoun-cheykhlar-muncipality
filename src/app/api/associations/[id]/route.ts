import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { AssociationsService } from '@/packages/associations/services/associations.service';

const associationsService = AssociationsService.instance();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const association = await associationsService.getAssociationById(id);

    if (!association) {
      return NextResponse.json({ error: 'Association not found' }, { status: 404 });
    }

    return NextResponse.json(association);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await associationsService.deleteAssociation(id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete association' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Association deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
      }

      const bytes = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(bytes).toString('base64');
      imageMimeType = imageFile.type;
    }

    const result = await associationsService.updateAssociation(
      id,
      {
        name,
        description,
      },
      imageBase64,
      imageMimeType
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update association' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Association updated successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
