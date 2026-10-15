import { NextRequest, NextResponse, after } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { TaxiStopsService } from '@/packages/taxiStops/services/taxiStops.service';
import { PushNotificationsService } from '@/packages/notifications/services/pushNotifications.service';

export const dynamic = 'force-dynamic';
const taxiStopsService = TaxiStopsService.instance();
const pushNotificationsService = PushNotificationsService.instance();

export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const taxiStops = await taxiStopsService.getTaxiStops();

    return NextResponse.json(taxiStops, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();

    const name = formData.get('name') as string;
    const fromLocation = formData.get('fromLocation') as string;
    const toLocation = formData.get('toLocation') as string;
    const hour = formData.get('hour') as string;
    const phone = formData.get('phone') as string;

    const taxiStop = await taxiStopsService.create({
      name,
      fromLocation,
      toLocation,
      hour,
      phone,
    });

    after(() =>
      pushNotificationsService.broadcast({
        title: 'محطة تاكسي جديدة',
        body: `${taxiStop.name}: ${taxiStop.fromLocation} – ${taxiStop.toLocation} (${taxiStop.hour})`,
        path: '/taxi-stops',
      })
    );

    return NextResponse.json(taxiStop, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
