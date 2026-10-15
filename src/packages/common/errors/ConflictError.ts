import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 409, code);
  }
}
