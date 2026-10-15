export abstract class HttpError extends Error {
  public readonly status: number;
  /** Machine-readable reason sent to API clients as `code`, e.g. 'INVALID_PASSWORD'. */
  public readonly code?: string;

  constructor(msg: string, status: number, code?: string) {
    super(msg);
    this.status = status;
    this.code = code;
  }
}
