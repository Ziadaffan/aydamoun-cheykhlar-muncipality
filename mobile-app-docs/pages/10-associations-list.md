# 10 — Associations list

| | |
|---|---|
| **Route** | `/associations` |
| **Web parity** | [src/app/associations/page.tsx](../../src/app/associations/page.tsx) → [AssociationsPage.tsx](../../src/packages/associations/components/AssociationsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/associations` |

## Current behaviour (release 1.2)

The sections below describe the original port; where they differ, this list wins.

- Data-first states (`QueryView`), measured `CldImage` cells with a fallback icon; odd grids are padded instead of stretching the last card.
- `https://aydamoun-cheykhlar-municipality.org/associations` opens this screen when the app is installed.

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
