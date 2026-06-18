# 10 — Associations list

| | |
|---|---|
| **Route** | `/associations` |
| **Web parity** | [src/app/associations/page.tsx](../../src/app/associations/page.tsx) → [AssociationsPage.tsx](../../src/packages/associations/components/AssociationsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/associations` |

## Purpose

Browse community associations active in the municipality.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Associations                  │
├─────────────────────────────────────┤
│                                     │
│  H2  Community associations         │
│  Subtitle…                          │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ <image>  │  │ <image>  │         │  2-col grid
│  │ Name     │  │ Name     │         │
│  │ Excerpt… │  │ Excerpt… │         │
│  └──────────┘  └──────────┘         │
│  …                                  │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { data } = useQuery({
  queryKey: ['associations'],
  queryFn: () => api<Association[]>('/api/associations'),
});
```

## `AssociationCard`

- `<CldImage src={picaURL} />` 1:1 ratio, rounded top corners.
- `name` (h3).
- `description` truncated to 3 lines.
- Whole card pressable → `router.push(\`/associations/${id}\`)`.

## States

- Loading → `<LoadingScreen>`.
- Empty → `<EmptyState icon={Users}>`.
- Error → `<ErrorState onRetry />`.

## Pull-to-refresh

Yes.

## Excluded

Create / edit / delete (admin only).
