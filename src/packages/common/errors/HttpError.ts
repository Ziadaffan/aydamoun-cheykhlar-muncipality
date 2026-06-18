export abstract class HttpError extends Error {
  public readonly status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}
