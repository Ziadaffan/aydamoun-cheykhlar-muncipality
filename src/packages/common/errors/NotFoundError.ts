import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(msg: string) {
    super(msg, 404);
  }
}
