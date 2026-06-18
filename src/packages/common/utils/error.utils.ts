import { HttpError } from '../errors/HttpError';
import { NextResponse } from 'next/server';

export const returnProperErrorMessage = (error: any) => {
  const status = 500;
  const erroMessage = 'internal server error';
  console.log('error', error);
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: erroMessage }, { status: status });
};
