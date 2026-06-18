# 07 — Jobs list

| | |
|---|---|
| **Route** | `/jobs` |
| **Web parity** | [src/app/jobs/page.tsx](../../src/app/jobs/page.tsx) → [JobsPage.tsx](../../src/packages/jobs/components/JobsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/jobs` |

## Purpose

Browse open job postings in the municipality.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Job openings                  │
├─────────────────────────────────────┤
│                                     │
│  H2  Current openings               │
│  Subtitle…                          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Civil engineer              │    │
│  │ 🏢 Public works dept.        │    │
│  │ 📍 Aydamoun                  │    │
│  │ 💰 1,500–2,000 USD/mo        │    │
│  │ ⏳ Deadline: Jun 30          │    │
│  │ Short description…           │    │
│  │              [ View details ]│    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ …                           │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { data, isLoading, error, refetch, isRefetching } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => api<Job[]>('/api/jobs'),
});
```

Filter client-side to `active === true` if you want only open positions (web doesn't filter — keep parity).

## Components

### `JobCard`

- Title (h3, bold).
- Provider row with `Briefcase` icon.
- Location row with `MapPin` icon.
- Salary row with `Banknote` icon — if `salary` is null, show `t('jobs.salary.negotiable')`.
- Deadline row with `Clock` icon — if `deadline` is null, omit; if it's in the past, show in red.
- Truncated description (3 lines).
- "View details" button → `router.push(\`/jobs/${id}\`)` (see [Jobs detail](08-jobs-detail.md)).

### Empty state

`<EmptyState icon={Briefcase} title={t('jobs.empty.title')} body={t('jobs.empty.body')} />`.

## States

- Loading / error: standard `<LoadingScreen>` / `<ErrorState>`.
- Pull-to-refresh.

## i18n keys

`jobs.page.{title,subtitle}`, `jobs.salary.negotiable`, `jobs.deadline.{none,past}`, `jobs.empty.{title,body}`, `jobs.viewDetails`.

## Excluded

The "Create new job" button (admin only).
