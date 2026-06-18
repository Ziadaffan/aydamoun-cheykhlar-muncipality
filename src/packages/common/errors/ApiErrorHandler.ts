import { NextRequest, NextResponse } from 'next/server';
import { HttpError } from './HttpError';

export type HttpHandler = (request: NextRequest, context?: any) => Promise<NextResponse>;

export const ApiErrorHandler =
  (handler: HttpHandler): HttpHandler =>
  async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (e) {
      console.error('HTTP error', e);
      return handleErrors(e);
    }
  };

const handleErrors = (e: unknown): NextResponse => {
  let message: string;
  let status: number;
  if (e instanceof SyntaxError) {
    message = 'Invalid body';
    status = 400;
  } else if (e instanceof HttpError) {
    message = e.message;
    status = e.status;
  } else {
    message = 'Error';
    status = 500;
  }
  return NextResponse.json({ error: message }, { status });
};
