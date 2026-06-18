import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(msg: string) {
    super(msg, 401);
  }
}
