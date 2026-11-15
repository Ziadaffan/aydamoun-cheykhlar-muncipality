import { readApiError } from '@/packages/common/utils/api-error.utils';

/** A failed admin request; `code` is the API's machine-readable reason, when it sent one. */
export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code?: string
  ) {
    super(code ?? `HTTP_${status}`);
  }
}

/** fetch for the admin pages: JSON (or nothing on 204) back, AdminApiError on failure. */
export async function adminFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const info = await readApiError(response);
    throw new AdminApiError(info.status, info.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

/** JSON request body with its header. */
export const jsonBody = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

/**
 * Multipart body for forms with an image: plain values as strings, `image` as the
 * file when one was picked, `removeImage=true` when the admin cleared it.
 */
export function imageFormBody(
  method: string,
  values: Record<string, string | number | boolean | null | undefined>,
  image?: File | null,
  removeImage = false
): RequestInit {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value === null ? '' : String(value));
  });
  if (image) formData.append('image', image);
  if (removeImage && !image) formData.append('removeImage', 'true');
  return { method, body: formData };
}
