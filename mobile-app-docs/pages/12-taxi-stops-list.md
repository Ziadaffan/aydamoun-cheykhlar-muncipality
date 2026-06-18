# 12 — Taxi stops list

| | |
|---|---|
| **Route** | `/taxi-stops` |
| **Web parity** | [src/app/taxi-stops/page.tsx](../../src/app/taxi-stops/page.tsx) → [TaxiStopsPage.tsx](../../src/packages/taxiStops/components/TaxiStopsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/taxi-stops` |

## Purpose

Browse known taxi/van stops, their routes, departure times, and contact numbers.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Taxi stops                    │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Stop name                   │    │
│  │ ─ Aydamoun → Tripoli        │    │
│  │ ⏰ 07:30                     │    │
│  │ ☎  +961 …                   │    │
│  │  [ 📞 Call ]                │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ …                           │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

Single-column list of cards (taxi info is text-heavy; a 2-col grid would be cramped).

## Data fetching

```ts
const { data } = useQuery({
  queryKey: ['taxi-stops'],
  queryFn: () => api<TaxiStop[]>('/api/taxi-stops'),
});
```

## `TaxiStopCard`

- `name` (h3).
- Route row: `fromLocation → toLocation` rendered with an arrow icon between them (`ArrowRight` for LTR, `ArrowLeft` for RTL).
- Time row: `Clock` icon + `hour`.
- Phone row: `Phone` icon + tappable phone link → `Linking.openURL('tel:' + phone)`.
- Primary action: "Call" button (also `tel:`).

## States

- Loading → `<LoadingScreen>`.
- Empty → `<EmptyState icon={MapPin}>`.
- Error → `<ErrorState onRetry />`.

## Pull-to-refresh

Yes.

## Excluded

Create / edit / delete (admin only).
