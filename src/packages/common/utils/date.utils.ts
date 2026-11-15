/** Intl locale for dates on the site: English when the visitor chose English, Lebanese Arabic otherwise. */
export const dateLocale = (language?: string): string => {
  const lang = language ?? (typeof document !== 'undefined' ? document.documentElement.lang : 'ar');
  return lang?.startsWith('en') ? 'en-GB' : 'ar-LB';
};

/**
 * Date + time in the site language. Without `language`, the active one is read from <html lang>
 * (kept in sync by src/i18n.ts); on the server it is Arabic.
 */
export const formatDate = (date: Date | string, language?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(dateLocale(language), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};
