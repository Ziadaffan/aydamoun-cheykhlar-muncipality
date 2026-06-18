# 04 — Services list

| | |
|---|---|
| **Route** | `/(tabs)/services` |
| **Web parity** | [src/app/services/page.tsx](../../src/app/services/page.tsx) |
| **Auth** | Public (but submitting a form requires login) |
| **API** | `GET /api/services` |

## Purpose

Show every service the municipality offers, grouped by category. Tapping a service starts a submission flow (gated by login).

## Screen layout

```
┌─────────────────────────────────────┐
│  [≡]  Services           [globe]    │
├─────────────────────────────────────┤
│                                     │
│  ▮ AuthBanner (if guest)            │
│    "Log in to submit requests"      │
│    [ Log in ]   [ Sign up ]         │
│                                     │
│  ┌── Hero ─────────────────────┐    │
│  │  Municipal services         │    │
│  │  Submit licenses, …         │    │
│  └────────────────────────────┘     │
│                                     │
│  ┌── Section header ─────────────┐  │
│  │ 🏗️  Building licenses        │  │
│  └──────────────────────────────┘   │
│  ┌─────────────────────────────┐    │
│  │ Construction permit          │    │
│  │ Apply for a new build.       │    │
│  │                  [ Apply › ] │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Demolition permit            │    │
│  │                  [ Apply › ] │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌── Section header ─────────────┐  │
│  │ 🌱  Environmental services    │  │
│  └──────────────────────────────┘   │
│  …                                  │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { data: services, isLoading, error } = useQuery({
  queryKey: ['services'],
  queryFn: () => api<Service[]>('/api/services'),
});
```

Group client-side by `service.type`:

```ts
const grouped = useMemo(() => {
  const order: ServiceType[] = [
    'LICENSEES_AND_CONSTRUCTION_SERVICES',
    'ENVIRONMENTAL_SERVICES',
    'ADMINISTRATIVE_SERVICES',
    'DOWNLOAD_OFFICIAL_FORMS_SERVICES',
    'COMPLAINTS_AND_SUGGESTIONS_SERVICES',
    'OTHER',
  ];
  return order
    .map(type => ({ type, items: (services ?? []).filter(s => s.type === type) }))
    .filter(g => g.items.length > 0);
}, [services]);
```

## Per-category metadata

Centralize so the same icon/colour/title shows everywhere:

```ts
export function serviceCategoryMeta(type: ServiceType) {
  switch (type) {
    case 'LICENSEES_AND_CONSTRUCTION_SERVICES':
      return { icon: 'Hammer',   color: '#fde68a', titleKey: 'services.categories.buildingLicenses' };
    case 'ENVIRONMENTAL_SERVICES':
      return { icon: 'Leaf',     color: '#bbf7d0', titleKey: 'services.categories.environmental' };
    case 'ADMINISTRATIVE_SERVICES':
      return { icon: 'FileText', color: '#bfdbfe', titleKey: 'services.categories.administrative' };
    case 'DOWNLOAD_OFFICIAL_FORMS_SERVICES':
      return { icon: 'Download', color: '#e9d5ff', titleKey: 'services.categories.officialForms' };
    case 'COMPLAINTS_AND_SUGGESTIONS_SERVICES':
      return { icon: 'MessageSquare', color: '#fecaca', titleKey: 'services.categories.complaints' };
    case 'OTHER':
      return { icon: 'Star', color: '#e5e7eb', titleKey: 'services.categories.other' };
  }
}
```

## Components

### `AuthBanner`

Shown only when `!user`. A blue-tinted alert card with two outlined buttons (login / signup). Hidden once authenticated.

### `ServiceCategorySection`

Pinned header with icon + label, background tint = `meta.color`. Children: vertical list of `<ServiceCard>`s.

### `ServiceCard`

```
┌──────────────────────────────────┐
│  <service.name>                  │
│  <service.description>           │
│                    [ Apply › ]   │
└──────────────────────────────────┘
```

Tap or tap "Apply":

```ts
if (!user) router.push(`/auth/login?next=/services/forms/${service.id}`);
else router.push(`/services/forms/${service.id}`);
```

## Loading / error / empty

- Loading: `<LoadingScreen />`.
- Error: `<ErrorState onRetry={refetch} />`.
- Empty (no services from API): `<EmptyState />` with "No services yet" copy.

## Pull-to-refresh

Yes, on the outer `ScrollView`.

## Excluded from web parity

The anchor links (`#buildingLicenses`, etc.) from the home page don't work natively on RN scroll views. To approximate, accept a `?anchor=` param on this screen and:

```tsx
useEffect(() => {
  if (anchor && sectionRefs[anchor]?.current) {
    sectionRefs[anchor].current.measure(...);
    scrollViewRef.current.scrollTo({ y, animated: true });
  }
}, [anchor, grouped]);
```
