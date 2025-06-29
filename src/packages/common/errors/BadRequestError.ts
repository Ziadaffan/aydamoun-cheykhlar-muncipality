import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
  constructor(msg: string) {
    super(msg, 400);
  }
}
