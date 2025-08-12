import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json('featured news');
  } catch (error) {
    returnProperErrorMessage(error);
  }
}
