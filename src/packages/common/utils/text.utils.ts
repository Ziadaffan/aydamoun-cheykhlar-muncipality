// Pure helpers, safe on both server and client.

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Plain text of admin-written content for card previews and summaries:
 * HTML tags and common markdown marks removed, entities decoded, whitespace collapsed.
 */
export function plainText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] === '#') {
        const point = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
      }
      return ENTITIES[code.toLowerCase()] ?? entity;
    })
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown image → alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown link → its text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // headings, quotes, list markers
    .replace(/(\*\*|__|\*|_|~~|`)(\S(?:.*?\S)?)\1/g, '$2') // emphasis, code
    .replace(/\s+/g, ' ')
    .trim();
}

/** `plainText`, cut at a word boundary to at most `max` characters (with an ellipsis when cut). */
export function textPreview(value: string | null | undefined, max = 300): string {
  const text = plainText(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
