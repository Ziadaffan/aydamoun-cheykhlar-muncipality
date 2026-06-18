# 08 — Jobs detail

| | |
|---|---|
| **Route** | `/jobs/[id]` |
| **Web parity** | None — web only shows cards in the list. New on mobile. |
| **Auth** | Public |
| **API** | `GET /api/jobs/[id]` |

## Purpose

Full description of a single job, with contact actions. Added on mobile because a card with a 3-line excerpt is cramped on small screens.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Job                           │
├─────────────────────────────────────┤
│                                     │
│  Civil engineer (h1)                │
│  Public works department            │
│                                     │
│  ┌── meta cards (2 cols) ─────┐     │
│  │ 📍  Aydamoun               │     │
│  │ 💰  1500–2000 USD/mo       │     │
│  │ ⏳  Deadline: Jun 30        │     │
│  │ ✓  Active                  │     │
│  └────────────────────────────┘     │
│                                     │
│  About the role                     │
│  Lorem ipsum dolor sit amet,        │
│  consectetur…                       │
│                                     │
│  ─── divider ───                    │
│                                     │
│  [ 📞 Call contact ]                │
│  [ ✉ Send email ]   (if applicable)│
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { id } = useLocalSearchParams<{ id: string }>();
const { data: job, isLoading } = useQuery({
  queryKey: ['job', id],
  queryFn: () => api<Job>(`/api/jobs/${id}`),
});
```

## Behaviors

- Phone → `Linking.openURL('tel:' + job.phone)`; only show if `phone` is set.
- Email button only if a contact email exists in the description (parse with a regex) — otherwise hide.
- Share → `Share.share({ message: \`${job.title} @ ${job.provider}\` + \`\n${BASE}/jobs/${id}\` })`.
- If `deadline < now`, replace primary action with a disabled "Deadline passed" pill.

## States

- 404 → `<EmptyState>` ("Job no longer available").
- Loading → `<LoadingScreen>`.

## Excluded

Edit / delete (admin only).
