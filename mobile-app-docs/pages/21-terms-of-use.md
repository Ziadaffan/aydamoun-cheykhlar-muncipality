# 21 — Terms of use

| | |
|---|---|
| **Route** | `/legal/terms-of-use` |
| **Web parity** | [src/app/terms-of-use/page.tsx](../../src/app/terms-of-use/page.tsx) (currently a `<ComingSoon>` placeholder on web) |
| **Auth** | Public |
| **API** | None |

## Purpose

Static legal page describing acceptable use of the app and disclaimer.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Terms of use                  │
├─────────────────────────────────────┤
│                                     │
│  Terms of use (h1)                  │
│  Last updated: …                    │
│                                     │
│  H2  Acceptance                     │
│  Body…                              │
│                                     │
│  H2  User responsibilities          │
│  Body…                              │
│                                     │
│  H2  Limitation of liability        │
│  Body…                              │
│                                     │
│  H2  Changes                        │
│  Body…                              │
│                                     │
│  H2  Contact                        │
│  Body…                              │
│                                     │
└─────────────────────────────────────┘
```

## Content source

Like [Privacy policy](20-privacy-policy.md), no published copy exists yet on the web. Until the municipality provides one, render a `<ComingSoon>` state:

```
<EmptyState
  icon={ScrollText}
  title={t('legal.terms.comingSoonTitle')}
  body={t('legal.terms.comingSoonBody')}
/>
```

When copy is ready, swap to the same section-based layout as Privacy.

## Excluded

Nothing.
