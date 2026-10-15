import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 404, code);
  }
}
