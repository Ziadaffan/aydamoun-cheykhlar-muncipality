# 16 — Change password

|                |                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(account)/profile/change-password`                                                                                                                                                |
| **Web parity** | [src/app/profile/change-password/page.tsx](../../src/app/profile/change-password/page.tsx) → [ChangePasswordPage.tsx](../../src/packages/profile/components/ChangePasswordPage.tsx) |
| **Auth**       | **Required**                                                                                                                                                                        |
| **API**        | `PATCH /api/user`                                                                                                                                                                   |

## Purpose

Change the signed-in user's password.

## Form (`changePasswordSchema`, `features/auth/validation.ts`)

Same rules as the website's `passwordChangeSchema` and the server:

- `oldPassword`: required only (an older, weaker password must still be accepted).
- `newPassword`: the [password rule](../02-api-integration.md#password-rule) — 6+ characters with a lower-case letter, an upper-case letter and a digit — and different from the current one (`errors.password.same`).
- `confirmPassword`: must match.

All three are `InputPassword` (show/hide, autocorrect off). Mode `onTouched`; errors show on visited fields or after a submit attempt.

## Submit

`useChangePassword()` → `PATCH /api/user { oldPassword, newPassword }`. Success → toast `profile.password.success`, `router.back()`. Existing tokens stay valid.

## Errors

| Server                                                                 | Shown                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| `400 INVALID_PASSWORD` (older deployments: message `Invalid password`) | under the current password, `profile.password.invalidOld` |
| `400 SAME_PASSWORD`                                                    | under the new password, `errors.password.same`            |
| `422 WEAK_PASSWORD`                                                    | under the new password, `errors.password.pattern`         |
| `401`                                                                  | signed out; the login prompt replaces the screen          |
| other                                                                  | banner, `userMessage(err)`                                |

A wrong current password is a `400`, never a `401`, so it never ends the session.

## Forgotten password

From the login screen: [18-login.md → Forgot password](18-login.md#forgot-password-authforgot-password).
