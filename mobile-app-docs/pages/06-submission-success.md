# 06 — Submission success

| | |
|---|---|
| **Route** | `/(tabs)/services/submission-success?id=<submission id>&service=<name>` |
| **Web parity** | [src/app/services/submission-success/page.tsx](../../src/app/services/submission-success/page.tsx) (`/services/submission-success?id=<submission id>`) |
| **Auth** | Reached only after sending a request |
| **API** | None |

## Purpose

Confirm the request, give its **request number** («رقم الطلب») and lead to «طلباتي».

## Request number

`id.slice(0, 8).toUpperCase()` — the app's `submissionRef` (features/user/queries.ts) and the
website's `submissionReference` (src/packages/serviceSubmissions/utils/reference.ts). It is
shown the same way in the app (success screen, «طلباتي» cards and request screen), on the
website (success page, profile cards) and in the admin dashboard (list column, view page).
Staff can search the admin list by it (case-insensitive, leading `#` and spaces ignored,
a partial number matches from its start), or by name or phone. Always rendered
left-to-right (`ltr()` in the app, `dir="ltr"` on the website).

## Screen layout (app)

```
┌─────────────────────────────────────┐
│              ( ✓ )                   │
│   تم تقديم طلبك بنجاح!                │
│   message                           │
│  ┌── رقم الطلب ──────────────────┐   │
│  │        A1B2C3D4  (selectable)  │   │
│  │        service name            │   │
│  │        keep this number…       │   │
│  └───────────────────────────────┘   │
│   • reviewed in 3–5 working days    │
│   • follow it in «طلباتي»           │
│   [ متابعة طلباتي ]  (primary)        │
│   [ العودة إلى الخدمات ]              │
│   [ الذهاب إلى الرئيسية ]             │
│   Need help? [اتصل] [راسل]           │
└─────────────────────────────────────┘
```

- The number card is one accessibility element read character by character.
- «متابعة طلباتي»: `router.dismissAll()` then the profile tab, so the Services tab is left
  on its list.
- Help buttons use `CONTACT` (constants/contact.ts) through `callPhone`/`sendEmail`; the
  email subject carries the request number.
- A success haptic on mount.
- No promise of notifications: the backend sends none.

## Website

After a successful submit the website form now opens this page with `?id=`; it shows the
same number, «متابعة طلباتي» (→ `/profile`), back to services and home.
