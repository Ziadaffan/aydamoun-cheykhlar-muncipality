# 15 — Edit profile

|                |                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(account)/profile/edit`                                                                                                                     |
| **Web parity** | The inline form section of [ProfilePage.tsx](../../src/packages/profile/components/ProfilePage.tsx) (`ProfileFormSection` + `ProfileActions`) |
| **Auth**       | **Required**                                                                                                                                  |
| **API**        | `PUT /api/user`                                                                                                                               |

## Purpose

Edit the signed-in user's name, email and phone.

## Form (`editProfileSchema`, `features/auth/validation.ts`)

Same rules as the website's `profile.validation.ts` and the server:

- `name`: required, trimmed, 2–50 characters.
- `email` / `phone`: optional, a blank field is sent as `null` (clears it); at least one must remain (`errors.atLeastOne`, shown on the email field; the phone Controller has `deps: ['email']`). Phones are normalized (`lib/phone.ts`) and must be 6–15 digits.

Pre-filled from `useSession().user`. Mode `onTouched`; Save is enabled once something changed and shows a spinner while saving. Return keys chain the fields; autofill hints `name`, `email`, `tel`.

## Submit

`useUpdateProfile()` → `PUT /api/user { name, email, phone }` → `{ user }`. On success the session user is updated (merged with the cached user, since older servers omit `image`), a toast shows and the screen closes.

## Errors

- Email/phone taken: `409 USER_EXISTS` (current API) or `400 "Email or phone already in use"` (older deployments) → on the changed field (`profile.edit.emailTaken` / `phoneTaken`), or a banner (`profile.edit.conflict`) when both changed.
- `400 INVALID_PHONE` → on the phone field. A number that did not change is not re-validated by the server.
- `401` → signed out; the login prompt replaces the screen.
- Others → `userMessage(err)` in a banner.

## Excluded

No avatar upload (no API).
