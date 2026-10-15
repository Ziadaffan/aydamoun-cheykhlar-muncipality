# 18 — Login (and forgot password)

|                |                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(auth)/login`, `/(auth)/forgot-password`                                                                                                                                                                                |
| **Web parity** | [src/app/auth/login/page.tsx](../../src/app/auth/login/page.tsx) → [LogInPage.tsx](../../src/packages/auth/login/LogInPage.tsx); [ForgotPasswordPage.tsx](../../src/packages/auth/forgot-password/ForgotPasswordPage.tsx) |
| **Auth**       | Public (closes itself if already logged in)                                                                                                                                                                               |
| **API**        | `POST /api/auth/mobile-login`, `POST /api/auth/forgot-password` — see [02-api-integration.md](../02-api-integration.md#auth)                                                                                              |

## Purpose

Authenticate a returning user with email **or** phone + password, and start an email password reset.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  تسجيل الدخول                  │
├─────────────────────────────────────┤
│            ┌─────┐                  │
│            │ logo│                  │
│            └─────┘                  │
│       مرحباً بعودتك                 │
│       helper (email or phone)       │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  البريد الإلكتروني أو رقم الهاتف     │
│  [_____________________________]    │
│  كلمة المرور                        │
│  [••••••••••••••••••]   [👁]        │
│              [ نسيت كلمة المرور؟ ]   │
│  [            دخول            ]     │
│  ليس لديك حساب؟ [إنشاء حساب]        │
└─────────────────────────────────────┘
```

## Form

`loginSchema` in `features/auth/validation.ts`:

- `identifier`: required, trimmed; must be an email or a valid phone (checked after normalizing with `lib/phone.ts`, the same function as the server's `phone.utils.ts`: 6–15 digits, optional `+`). Emails are sent lower-cased; phones are sent **as typed**: the server normalizes them and also tries the raw text and the old signup form (spaces and dashes removed), so numbers stored before normalization (`"03 123 456"`, `"03/123456"`) still match.
- `password`: required only. No length or pattern rule: older passwords that predate the [password rule](../02-api-integration.md#password-rule) must still log in.

Validation mode `onTouched`. The submit button is only disabled while a request runs, so a tap shows every error and focuses the first field. Return keys chain the fields (`next` → `go`); autofill hints `username` / `current-password`.

## Submit

`useSession().login(identifier, password)` → `POST /api/auth/mobile-login`, stores the token and user (see [03-authentication.md](../03-authentication.md)).

- `401` (`INVALID_CREDENTIALS`) → banner `auth.login.errors.invalid`. A `401` on `/api/auth/*` never signs anyone out.
- Anything else → `userMessage(err)` (`lib/errors.ts`): network, timeout and server errors in Arabic.
- Success → toast `auth.login.success`, then leave the auth screens.

## Navigation (`features/auth/navigation.ts`)

- `next` (route param) is followed only when `safeNext()` accepts it: an in-app path starting with `/`, not `//host`, no scheme, not an auth screen.
- `leaveAuth(next)`: `router.dismissTo(next)` when given; otherwise `router.dismiss()` when the auth stack can be dismissed, else `router.replace('/(tabs)/home')`. So a login opened from More, Services or the account gate returns there.
- Login ↔ signup links pass `next` along and replace each other, so only one auth screen is ever on the stack.
- Already logged in on arrival (a stale link) → `leaveAuth(next)` immediately.
- Signup can open login with `identifier` prefilled and `created=1` (account created but the automatic login failed) → success banner `errors.signupLoginFailed`.

## Forgot password (`/(auth)/forgot-password`)

- Opened from «نسيت كلمة المرور؟» (pre-fills the email when the identifier contains `@`) or from signup's "account exists" banner.
- One email field → `POST /api/auth/forgot-password { email }`. The API always answers `200` for a non-empty email, so the success state shows the same text whether or not an account exists (`auth.forgotPassword.sent`, the website's wording) plus «إعادة الإرسال» and «العودة إلى تسجيل الدخول».
- The emailed link opens the **website** page `/auth/reset-password?token=…` (valid 1 hour); the new password must follow the [password rule](../02-api-integration.md#password-rule). The user then logs in in the app.
- Phone-only accounts can't receive the link: a hint with call / email actions (`CONTACT` in `constants/contact.ts`); an admin sets a temporary password from the website's admin page.
- `404`/`405` (a deployment without the endpoint) → `auth.forgotPassword.unavailable` and the contact actions.

## i18n keys

`auth.login.{title,welcome,helper,identifier,password,submit,submitting,success,noAccount,signup,forgotPassword,errors.invalid}`, `auth.forgotPassword.*`, `errors.signupLoginFailed`.
