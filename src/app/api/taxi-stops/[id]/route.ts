import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { TaxiStopsService } from '@/packages/taxiStops/services/taxiStops.service';

const taxiStopsService = TaxiStopsService.instance();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const taxiStop = await taxiStopsService.getTaxiStopById(id);

    if (!taxiStop) {
      return NextResponse.json({ error: 'Taxi stop not found' }, { status: 404 });
    }

    return NextResponse.json(taxiStop);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await taxiStopsService.deleteTaxiStop(id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete taxi stop' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Taxi stop deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const fromLocation = formData.get('fromLocation') as string;
    const toLocation = formData.get('toLocation') as string;
    const hour = formData.get('hour') as string;
    const phone = formData.get('phone') as string;

    const result = await taxiStopsService.updateTaxiStop(id, {
      name,
      fromLocation,
      toLocation,
      hour,
      phone,
    });

    if (!result) {
      return NextResponse.json({ error: 'Failed to update taxi stop' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Taxi stop updated successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
