# 14 — Profile (and delete account)

|                |                                                                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(account)/profile`, `/(account)/profile/delete-account`                                                                                                         |
| **Web parity** | [src/app/profile/page.tsx](../../src/app/profile/page.tsx) → [ProfilePage.tsx](../../src/packages/profile/components/ProfilePage.tsx), `DeleteAccountSection.tsx` |
| **Auth**       | **Required** (guests see the login prompt in place)                                                                                                               |
| **API**        | `GET /api/user/service-submissions`, `DELETE /api/user/service-submissions/[id]`, `DELETE /api/user`                                                              |

## Purpose

The signed-in resident's home base: their requests first, then account settings, logout and account deletion.

## Account gate

`app/(tabs)/(account)/_layout.tsx` wraps every account screen (Stack `screenLayout`): while the stored session loads → `LoadingScreen`; guest → `AuthNotice variant="full"` under the screen's own header, whose login/signup buttons push the auth screens with `next` = the current path, so the user comes back to the same screen. No redirect.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  الملف الشخصي                  │
├─────────────────────────────────────┤
│  ProfileHeader (avatar, name,       │
│  email · phone)                     │
│                                     │
│  ─── طلباتي (n طلبات) ───           │
│  ┌ SubmissionCard ──────────── › ┐  │
│  │ service · رقم الطلب · date    │  │
│  │ [status]   [تعديل] [حذف]      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌ settings card ────────────────┐  │
│  │ تعديل الملف الشخصي          › │  │
│  │ تغيير كلمة المرور           › │  │
│  │ تسجيل الخروج                  │  │
│  └───────────────────────────────┘  │
│  حذف الحساب (danger row)            │
└─────────────────────────────────────┘
```

## Requests

- `useMySubmissions()` (`features/user/queries.ts`, key `['my-submissions']`, enabled only when signed in, newest first), rendered through `QueryView`: cached data first, a banner when a refresh fails, skeleton cards while loading, `ErrorState` with retry.
- Count: `tPlural('profile.submissions.total', n)`.
- Empty → «تقديم طلب جديد» opens Services.
- Every card opens `/profile/submissions/[id]/edit` ([17](17-edit-submission.md)), read-only unless `PENDING`. The card shows «رقم الطلب» = `submissionRef(id)` (first 8 characters of the id, upper-case, LTR) — the same reference as the success screen and the website/admin.
- `PENDING` cards also have 44pt edit and delete buttons. Delete asks for confirmation; the card dims with a spinner until the server answers; the hook shows the success or error toast.
- Pull-to-refresh refetches the list.

## Settings

- «تعديل الملف الشخصي» → [15](15-edit-profile.md); «تغيير كلمة المرور» → [16](16-change-password.md).
- «تسجيل الخروج»: confirmation, then `signOut()` (local, instant), toast, `router.replace('/(tabs)/home')`.

## Delete account (`/profile/delete-account`)

Required by the App Store and Google Play. Same flow and wording as the website's `DeleteAccountSection`:

1. Explains what is deleted (`profile.deleteAccount.*`, including how many requests go with it).
2. Password field (the current password: no strength rule).
3. Destructive confirmation `Alert`.
4. `DELETE /api/user { password }`. Success → `router.replace('/(tabs)/home')`, `clearSession()` (drops private caches), success toast.

Errors: `400 INVALID_PASSWORD` (or the old message `Invalid password`) and `PASSWORD_REQUIRED` → on the password field; `401` → signed out, the login prompt replaces the screen; `404`/`405` (deployment without the endpoint) → banner with «مراسلة البلدية» (email to `CONTACT.email`); others → `userMessage(err)`.

The request deletion relies on the `ON DELETE CASCADE` migration `20261013120000_cascade_delete_user_submissions`.
