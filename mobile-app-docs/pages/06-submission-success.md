# 06 — Submission success

| | |
|---|---|
| **Route** | `/(tabs)/services/submission-success` |
| **Web parity** | [src/app/services/submission-success/page.tsx](../../src/app/services/submission-success/page.tsx) |
| **Auth** | Required (only reachable post-submit) |
| **API** | None |

## Purpose

Confirmation screen after a service submission. Reassures the user, sets expectations on review time, offers next steps.

## Screen layout

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────┐                 │
│         │   ✓     │   (green disc)  │
│         └─────────┘                 │
│                                     │
│   Your request has been             │
│   submitted successfully!           │
│                                     │
│   Thank you for your submission.    │
│   We will review and contact you.   │
│                                     │
│   ┌── yellow tinted box ────────┐   │
│   │ • Reviewed in 3–5 days      │   │
│   │ • You'll be notified by     │   │
│   │   phone or email            │   │
│   └────────────────────────────┘    │
│                                     │
│   [ Return to services ]            │
│   [ Go to home ]                    │
│                                     │
│   Need help? Contact us at …        │
│                                     │
└─────────────────────────────────────┘
```

Centered vertically. Max content width `420`.

## Components

- Big green check icon (`<Check size={72} color="#10b981">` inside a circle).
- H2 title with the success message.
- Body paragraph with thank-you text.
- A `<Card>` with yellow tint (`#fef9c3` bg, `#a16207` text) listing the two next-step bullets.
- Primary button: "Return to services" → `router.replace('/services')`.
- Secondary button: "Go to home" → `router.replace('/home')`.
- Optional contact footer with phone/email links.

## Behavior

- `router.replace` (not `push`) so back-button doesn't return to the form.
- Trigger a celebratory haptic on mount: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`.

## i18n keys

`services.submissionSuccess.title`, `services.submissionSuccess.message`, `services.submissionSuccess.next.{review,notify}`, `services.submissionSuccess.cta.{services,home}`, `services.submissionSuccess.helpFooter`.

## Edge case

If a guest somehow lands here (e.g. via deep link), redirect to `/services` immediately:

```ts
useEffect(() => { if (!user) router.replace('/services'); }, [user]);
```
