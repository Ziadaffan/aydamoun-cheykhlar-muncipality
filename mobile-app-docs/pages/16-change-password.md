# 16 — Change password

| | |
|---|---|
| **Route** | `/(account)/profile/change-password` |
| **Web parity** | [src/app/profile/change-password/page.tsx](../../src/app/profile/change-password/page.tsx) → [ChangePasswordPage.tsx](../../src/packages/profile/components/ChangePasswordPage.tsx) |
| **Auth** | **Required** |
| **API** | `PATCH /api/user` |

## Purpose

Change the logged-in user's password.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Change password               │
├─────────────────────────────────────┤
│                                     │
│  Current password                   │
│  [••••••••••••••••••••]   [👁]      │
│                                     │
│  New password                       │
│  [••••••••••••••••••••]   [👁]      │
│  Helper: min 6 characters           │
│                                     │
│  Confirm new password               │
│  [••••••••••••••••••••]   [👁]      │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  [ Cancel ]   [ Update password ]   │
│                                     │
└─────────────────────────────────────┘
```

## Form

```ts
const schema = yup.object({
  oldPassword: yup.string().min(6).required(),
  newPassword: yup.string().min(6).required()
    .notOneOf([yup.ref('oldPassword')], 'errors.password.sameAsOld'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'errors.passwordMismatch').required(),
});
```

## Submit

```ts
const change = useMutation({
  mutationFn: ({ oldPassword, newPassword }) =>
    api('/api/user', {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
  onSuccess: () => {
    showBanner('success', t('profile.password.success'));
    setTimeout(() => router.replace('/profile'), 1200);
  },
  onError: (err) => showBanner('error', err.message), // e.g. "Invalid old password"
});
```

## UX details

- All three inputs are `<InputPassword>` with show/hide toggle.
- After success, clear the form and route back to `/profile`.
- Disable Save until form is dirty AND valid.

## Errors

- `400` "Invalid old password" — show under the old-password field.
- `400` validation — surface under the relevant field.

## Excluded

No "Forgot password" link yet (the API doesn't ship a reset flow). Add a TODO and stub a button that opens a `mailto:` to the municipality if you want to give users a recourse.
