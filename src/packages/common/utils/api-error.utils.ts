export type ApiErrorInfo = {
  status: number;
  /** Machine-readable reason, e.g. 'USER_EXISTS' (older deployments send none). */
  code?: string;
  /** English text for developers; never shown to users. */
  error?: string;
};

/** Reads `{ error, code }` from a failed API response; tolerates an empty or non-JSON body. */
export async function readApiError(response: Response): Promise<ApiErrorInfo> {
  const body = await response.json().catch(() => null);
  return {
    status: response.status,
    code: typeof body?.code === 'string' ? body.code : undefined,
    error: typeof body?.error === 'string' ? body.error : undefined,
  };
}

/** True when the response carries `code`, or (older deployments) exactly this English `error`. */
export function isApiError(info: ApiErrorInfo, code: string, legacyMessage?: string): boolean {
  return info.code === code || (!!legacyMessage && info.error?.trim().toLowerCase() === legacyMessage.toLowerCase());
}
