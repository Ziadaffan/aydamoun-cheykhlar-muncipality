// One list of destinations for the desktop bar and the mobile drawer, in the
// app's order: the four everyday sections up front, the rest under "More".

export type NavItem = {
  href: string;
  /** i18n key under navigation.main */
  labelKey: string;
};

export const PRIMARY_ITEMS: NavItem[] = [
  { href: '/', labelKey: 'navigation.main.home' },
  { href: '/news', labelKey: 'navigation.main.news' },
  { href: '/services', labelKey: 'navigation.main.services' },
  { href: '/announcements', labelKey: 'navigation.main.announcements' },
];

export const MORE_ITEMS: NavItem[] = [
  { href: '/history', labelKey: 'navigation.main.history' },
  { href: '/jobs', labelKey: 'navigation.main.jobs' },
  { href: '/documents', labelKey: 'navigation.main.documents' },
  { href: '/associations', labelKey: 'navigation.main.associations' },
  { href: '/taxi-stops', labelKey: 'navigation.main.taxiStops' },
  { href: '/about-us', labelKey: 'navigation.main.aboutUs' },
];

export const ADMIN_ITEMS: NavItem[] = [
  { href: '/admin/service-submissions', labelKey: 'navigation.main.adminSubmissions' },
  { href: '/admin/announcements', labelKey: 'navigation.main.adminAnnouncements' },
  { href: '/admin/services', labelKey: 'navigation.main.adminServices' },
  { href: '/admin/council', labelKey: 'navigation.main.adminCouncil' },
  { href: '/admin/history', labelKey: 'navigation.main.adminHistory' },
  { href: '/admin/users', labelKey: 'navigation.main.adminUsers' },
];

export const ACCOUNT_ITEMS: NavItem[] = [
  { href: '/submissions', labelKey: 'navigation.main.submissions' },
  { href: '/profile', labelKey: 'navigation.main.profile' },
];

/** Home matches only itself; a section matches its own pages too (/news/123). */
export function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function anyActive(pathname: string | null, items: NavItem[]): boolean {
  return items.some(item => isActive(pathname, item.href));
}
