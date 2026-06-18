# 15 — Edit profile

| | |
|---|---|
| **Route** | `/(account)/profile/edit` |
| **Web parity** | The inline form section of [ProfilePage.tsx](../../src/packages/profile/components/ProfilePage.tsx) (`ProfileFormSection` + `ProfileActions`) |
| **Auth** | **Required** |
| **API** | `PUT /api/user` |

## Purpose

Edit the logged-in user's name, email, and phone.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Edit profile                  │
├─────────────────────────────────────┤
│                                     │
│  Full name                          │
│  [_____________________________]    │
│                                     │
│  Email                              │
│  [_____________________________]    │
│                                     │
│  Phone                              │
│  [_____________________________]    │
│                                     │
│  ▮ MessageBanner (success | error)  │
│                                     │
│  [ Cancel ]    [ Save ]             │
│                                     │
└─────────────────────────────────────┘
```

## Form

```ts
const schema = yup.object({
  name:  yup.string().trim().min(2).max(50).required(),
  email: yup.string().email().nullable().notRequired(),
  phone: yup.string().matches(/^[0-9+\-\s]{6,20}$/).nullable().notRequired(),
}).test('at-least-one', 'errors.atLeastOne', v => !!(v.email || v.phone));
```

Pre-fill from `useSession().user`.

## Submit

```ts
const update = useMutation({
  mutationFn: (values) => api<{ user: User }>('/api/user', {
    method: 'PUT', body: JSON.stringify(values),
  }),
  onSuccess: ({ user }) => {
    session.refresh();         // pulls /api/auth/session
    showBanner('success', t('profile.edit.success'));
  },
  onError: (err) => showBanner('error', err.message),
});
```

## Buttons

- **Save** — disabled until form is dirty AND valid. Shows spinner while pending.
- **Cancel** — `router.back()`.

## Errors

- Server returns `409` if the new email/phone is already taken by another user — show translated message.
- Server returns `400` on validation issues — surface field-level errors if `details` is present.

## Excluded

No avatar change in current API. If the backend adds an upload endpoint later, add a circular image picker above the name field.
