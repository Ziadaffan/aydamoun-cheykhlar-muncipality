// Arabic-Indic (٠-٩) and Persian (۰-۹) digits, typed on Arabic keyboards.
const EASTERN_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;

// Separators people type or paste ("03 123-456", "(03) 123.456", the Lebanese "03/123456")
// plus the invisible bidi/format marks that phones and contact apps wrap around numbers.
// \s already covers no-break spaces and U+FEFF. Keep in sync with lib/phone.ts in the app.
const PHONE_NOISE = /[\s\-\u2010-\u2015\u2212.\/()\u200B-\u200F\u202A-\u202E\u2066-\u2069\u061C]/g;

const VALID_PHONE = /^\+?[0-9]{6,15}$/;

/**
 * Canonical form used to store and look up phone numbers: ASCII digits with one
 * optional leading '+'. "٠٣ ١٢٣ ٤٥٦", "03-123-456", "03/123456" and "03123456" all
 * map to the same account. Mirrors normalizePhone() in the mobile app.
 */
export function normalizePhone(value: unknown): string {
  const compact = String(value ?? '')
    .replace(EASTERN_DIGITS, digit => {
      const code = digit.charCodeAt(0);
      return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
    })
    .replace(PHONE_NOISE, '');
  const digits = compact.replace(/\+/g, '');
  return compact.startsWith('+') ? `+${digits}` : digits;
}

/** Expects a value already passed through normalizePhone(). */
export function isValidPhone(normalized: string): boolean {
  return VALID_PHONE.test(normalized);
}

/**
 * Phone values to look an account up by. Numbers stored before normalization keep the
 * form they were saved in: as typed on the website's profile form ("03 123 456"), or with
 * only spaces and dashes removed by signup ("03/123456", "(03)123456"). So besides the
 * canonical form, the raw text and that older form are tried too.
 */
export function phoneLookupValues(raw: string): string[] {
  const trimmed = raw.trim();
  const legacy = trimmed.replace(/\s|-/g, '');
  return Array.from(new Set([normalizePhone(trimmed), trimmed, legacy].filter(Boolean)));
}
