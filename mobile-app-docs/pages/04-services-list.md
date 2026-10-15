# 04 — Services list

| | |
|---|---|
| **Route** | `/(tabs)/services` (optional `?anchor=<ServiceType>&at=<timestamp>`) |
| **Web parity** | [src/app/services/page.tsx](../../src/app/services/page.tsx) |
| **Auth** | Public (sending a request requires login, see [05](05-service-form.md)) |
| **API** | `GET /api/services` |
| **App files** | `app/(tabs)/services/index.tsx`, `components/services/*`, `features/services/meta.ts`, `features/services/queries.ts` |

## Purpose

Every service the municipality offers, grouped by category. Tapping a service opens its
request form, for guests too.

## Screen layout

```
┌─────────────────────────────────────┐
│  (status-bar scrim)                 │
│  ┌── Hero (static, renders at once)┐│
│  │  خدمات البلدية                    ││
│  │  subtitle                        ││
│  └──────────────────────────────────┘│
│  ▮ AuthNotice compact (guests only, │
│    hidden while the session loads)  │
│  ▮ info note when a Home shortcut   │
│    points to an empty category      │
│                                     │
│  ┌── Category band (icon + name) ──┐│
│  │ ServiceCard: name, description, ││
│  │              [ تقدّم › ]          ││
│  └──────────────────────────────────┘│
│  …                                  │
│  تحميل النماذج الرسمية: always shown, │
│  with a link card to Documents      │
│  («تبحث عن نموذج للتحميل؟»)          │
└─────────────────────────────────────┘
```

## Data

`useServices()` → `['services']` (persisted for offline start). Grouped client-side in
`SERVICE_CATEGORY_ORDER` (features/services/meta.ts), empty categories hidden except the
official-forms one. The list goes through `QueryView`: skeleton on first load, inline
error with a busy retry, refresh-failed banner over cached data, pull-to-refresh driven
only by the user's pull.

## Category metadata

`serviceCategoryMeta(type)` in features/services/meta.ts: a lucide `Icon`, a pastel
`color`, a dark `iconColor` and `titleKey` (`services.categories.<TYPE>`). Home's
shortcut tiles use the same metadata. The website's equivalent is
`getServiceCategoryMeta` (service.utils.ts), which also gives the request form's
category (see [05](05-service-form.md#category-fields)).

## Behaviour

- ServiceCard is a single touchable (role button, label «name، description», hint
  «يفتح نموذج الطلب»).
- Guests: AuthNotice login/signup carry `next=/(tabs)/services`.
- `?anchor=` (Home shortcuts): scrolls to the category band, offset by the top safe-area
  inset; `at` makes a second tap on the same shortcut scroll again.
- `useScrollToTop` on the tab; the refresh spinner is offset below the status-bar scrim.
