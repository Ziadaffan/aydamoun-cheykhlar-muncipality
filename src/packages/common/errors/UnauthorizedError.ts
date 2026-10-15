import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 401, code);
  }
}
