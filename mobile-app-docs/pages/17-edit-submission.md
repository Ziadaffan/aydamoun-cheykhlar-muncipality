# 17 — Edit submission

|                |                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(account)/profile/submissions/[id]/edit`                                                                                                                                                                                        |
| **Web parity** | [src/app/profile/edit-submission/[submissionId]/page.tsx](../../src/app/profile/edit-submission/[submissionId]/page.tsx) → [EditSubmissionPage.tsx](../../src/packages/profile/edit-submission/components/EditSubmissionPage.tsx) |
| **Auth**       | **Required** (user can only touch their own submissions)                                                                                                                                                                          |
| **API**        | `GET /api/user/service-submissions/[id]`, `PUT /api/user/service-submissions/[id]`, `DELETE /api/user/service-submissions/[id]`                                                                                                   |

## Purpose

Let a user view any of their requests, and revise or delete it while it is `PENDING`. Once `IN_PROGRESS` / `COMPLETED` / `REJECTED`, it is read-only.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  تعديل الطلب / تفاصيل الطلب    │
├─────────────────────────────────────┤
│                                     │
│  Service name (h2)                  │
│  [ Pending ] badge                  │
│                                     │
│  Full name *                        │
│  [_____________________________]    │
│                                     │
│  Phone *                            │
│  [_____________________________]    │
│                                     │
│  Email                              │
│  [_____________________________]    │
│                                     │
│  Address *                          │
│  [_____________________________]    │
│                                     │
│  Description                        │
│  ┌────────────────────────────┐     │
│  └────────────────────────────┘     │
│                                     │
│  --- Category-specific fields ---   │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  [ Delete ] (danger)                │
│  [ Cancel ]   [ Save changes ]      │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

`useSubmissionDetail(id)` (`features/user/queries.ts`, key `['submission', id]`): `GET /api/user/service-submissions/[id]`, with `initialData` from the `['my-submissions']` list cache so the screen opens at once and refreshes in the background (a failed refresh keeps the cached copy). Rendered through `QueryView`; `404` → «الطلب غير موجود» with a back button.

## Title and modes

- `PENDING` → title «تعديل الطلب», editable form.
- Any other status → title «تفاصيل الطلب», read-only rows, a note that the request can no longer be edited, and a back button.
- Both show «رقم الطلب» = `submissionRef(id)` (first 8 characters of the id, upper-case, LTR), the reference shown on the success screen, the website profile and the admin dashboard.

## Form

The same fields, field names (`additionalInfo` keys) and rules as the [Service form](05-service-form.md) (`CommonFields`, `DynamicFields`, `getSchema` from `features/services/submissionForm.tsx`), chosen by `submission.service.type` and pre-filled from the submission. Background refreshes keep the user's unsaved edits (`keepDirtyValues`).

## Save

`useUpdateSubmission(id)` → `PUT /api/user/service-submissions/[id]`, then invalidates `['my-submissions']` and `['submission', id]`. Progress on the button, success toast and `router.back()`; errors in a banner via `userMessage(err)`.

## Delete

Confirmation `Alert` (destructive), then `useDeleteSubmission()` → `DELETE /api/user/service-submissions/[id]`; the hook shows the success or error toast; the screen goes back.

## Leaving with unsaved edits

`usePreventRemove` (from `expo-router/react-navigation`) asks before discarding changes on back, swipe, cancel and tab switches; after a save or delete it doesn't ask.

## States

- Submitting → Save and Delete disabled, spinner in the active button.
- `401` → signed out; the account gate's login prompt replaces the screen.
