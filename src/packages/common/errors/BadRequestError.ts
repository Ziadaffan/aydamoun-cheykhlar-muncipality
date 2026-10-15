import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 400, code);
  }
}
