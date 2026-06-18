# 11 — Association detail

| | |
|---|---|
| **Route** | `/associations/[id]` |
| **Web parity** | [src/app/associations/[id]/page.tsx](../../src/app/associations/[id]/page.tsx) → [AssociationPage.tsx](../../src/packages/associations/components/[id]/AssociationPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/associations/[id]` |

## Purpose

Show all info about a single association.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Association                   │
├─────────────────────────────────────┤
│  ┌────────── Hero image ─────────┐  │
│  │       <picaURL>              │  │
│  └──────────────────────────────┘   │
│                                     │
│  Name (h1)                          │
│                                     │
│  About                              │
│  Full description text here…        │
│                                     │
│  [ Share ]                          │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { id } = useLocalSearchParams<{ id: string }>();
const { data: assoc, isLoading } = useQuery({
  queryKey: ['association', id],
  queryFn: () => api<Association>(`/api/associations/${id}`),
});
```

## Components

- Hero: `<CldImage src={assoc.picaURL} style={{ width: '100%', aspectRatio: 16/9 }} />`.
- `name` heading + full `description` body.
- Share action: `Share.share({ message: \`${assoc.name} — ${BASE}/associations/${id}\` })`.

## States

- Loading → `<LoadingScreen>`.
- 404 → `<EmptyState>`.
- Error → `<ErrorState onRetry />`.

## Excluded

Edit / delete (admin only).
