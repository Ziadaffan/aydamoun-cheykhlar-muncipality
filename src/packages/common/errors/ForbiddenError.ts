import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 403, code);
  }
}
