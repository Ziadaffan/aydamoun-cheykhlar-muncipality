export const getResourceType = (fileExtension: string): 'raw' | 'image' | 'video' => {
  const ext = fileExtension.toLowerCase();

  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z'].includes(ext)) {
    return 'raw';
  }

  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
    return 'video';
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }

  return 'raw';
};

// What the upload form accepts, plus the usual office formats. `Document.type` is the file's extension.
const DOCUMENT_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
};

/** The stored extension, lower-cased and safe to put in a file name. */
export const documentExtension = (type: string): string => type.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'bin';

export const documentMimeType = (type: string): string => DOCUMENT_MIME_TYPES[documentExtension(type)] ?? 'application/octet-stream';

/** True when `fileUrl` is a web address; otherwise it holds the file itself as base64 (how uploads are stored). */
export const isRemoteFileUrl = (fileUrl: string): boolean => /^https?:\/\//i.test(fileUrl);

/** Public address of a document's file: GET /api/documents/<id>/file serves it. */
export const documentFileUrl = (origin: string, id: string): string => `${origin}/api/documents/${encodeURIComponent(id)}/file`;

/** The base64 payload of a stored file, without a `data:…;base64,` prefix if one was saved. */
export const inlineFileBase64 = (fileUrl: string): string => (fileUrl.startsWith('data:') ? fileUrl.slice(fileUrl.indexOf(',') + 1) : fileUrl);

/**
 * Content-Disposition for serving a document inline: an ASCII fallback name plus
 * the real (often Arabic) title per RFC 6266 / RFC 5987.
 */
export const documentContentDisposition = (title: string, type: string): string => {
  const ext = documentExtension(type);
  const cleaned = title.replace(/[\u0000-\u001f\u007f\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim();
  // Cut by code point and drop lone surrogates: encodeURIComponent throws on half an emoji.
  const base = Array.from(cleaned)
    .filter(char => !/^[\ud800-\udfff]$/.test(char))
    .slice(0, 100)
    .join('');
  const name = `${base || 'document'}.${ext}`;
  const encoded = encodeURIComponent(name).replace(/['()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return `inline; filename="document.${ext}"; filename*=UTF-8''${encoded}`;
};
