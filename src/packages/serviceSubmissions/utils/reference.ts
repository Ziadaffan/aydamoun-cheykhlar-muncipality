// The short request number residents see in the mobile app («رقم الطلب») and quote
// on the phone: the first 8 characters of the submission id, upper-case. The app
// computes it the same way (submissionRef in features/user/queries.ts); keep both in step.
const REFERENCE_LENGTH = 8;

export function submissionReference(id: string): string {
  return id.slice(0, REFERENCE_LENGTH).toUpperCase();
}

/**
 * Whether a search typed by staff matches a submission's reference: case-insensitive,
 * ignoring spaces and a leading '#'. A partial number matches from its start, and so
 * does a longer piece of the full id.
 */
export function matchesSubmissionReference(id: string, query: string): boolean {
  const needle = query.replace(/\s+/g, '').replace(/^#/, '').toUpperCase();
  return needle.length > 0 && id.toUpperCase().startsWith(needle);
}
