import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
  constructor(msg: string) {
    super(msg, 403);
  }
}
