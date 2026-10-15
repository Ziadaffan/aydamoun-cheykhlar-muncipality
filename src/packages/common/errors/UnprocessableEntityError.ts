import { HttpError } from './HttpError';

export class UnprocessableEntityError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 422, code);
  }
}
