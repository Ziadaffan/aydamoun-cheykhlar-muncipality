# 18 — Login

|                |                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(auth)/login`                                                                                                                 |
| **Web parity** | [src/app/auth/login/page.tsx](../../src/app/auth/login/page.tsx) → [LogInPage.tsx](../../src/packages/auth/login/LogInPage.tsx) |
| **Auth**       | Public (redirects to home if already logged in)                                                                                 |
| **API**        | NextAuth credentials flow — see [03-authentication.md](../03-authentication.md)                                                 |

## Purpose

Authenticate a returning user with email **or** phone + password.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]                                │
├─────────────────────────────────────┤
│                                     │
│            ┌─────┐                  │
│            │ logo│                  │
│            └─────┘                  │
│                                     │
│       Welcome back                  │
│       Log in to continue            │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  Email or phone                     │
│  [_____________________________]    │
│  ⚠ error text under field           │
│                                     │
│  Password                           │
│  [••••••••••••••••••]   [👁]        │
│  ⚠ error text under field           │
│                                     │
│              [ Forgot password? ]   │
│                                     │
│  [        Log in            ]       │
│                                     │
│  Don't have an account? [Sign up]   │
│                                     │
└─────────────────────────────────────┘
```

Centered card with horizontal padding `xl`, max content width 480.

## Form

```ts
const phoneRegex = /^[0-9+\-\s]{6,20}$/;
const schema = yup.object({
  identifier: yup
    .string()
    .trim()
    .required()
    .test('email-or-phone', 'errors.identifier.invalid', v => !!v && (yup.string().email().isValidSync(v) || phoneRegex.test(v))),
  password: yup.string().min(6).required(),
});
```

## Submit

See [03-authentication.md → Strategy A](../03-authentication.md#login-flow-strategy-a). The mobile-friendly summary:

```ts
const submit = useMutation({
  mutationFn: ({ identifier, password }) => auth.login({ identifier, password }),
  onSuccess: () => {
    showBanner('success', t('auth.login.success'));
    setTimeout(() => router.replace(next ?? '/home'), 800);
  },
  onError: err => {
    if (err.code === 'INVALID_CREDENTIALS') showBanner('error', t('auth.login.errors.invalid'));
    else showBanner('error', err.message);
  },
});
```

`next` comes from `?next=` in the URL (set by `RequireAuth`).

## On mount

If `useSession().user`, immediately `router.replace(next ?? '/home')`. No need to show the form to an already-logged-in user.

## UX details

- `<InputText>` `keyboardType` is `email-address` by default; toggle to `phone-pad` if the value starts with `+` or only digits.
- Submit button disabled until form valid; shows spinner while pending.
- Eye icon on password input.
- "Forgot password?" opens a screen with a single email field that calls `POST /api/auth/forgot-password` `{ email }`. Always show the same success message (the API never reveals whether the email exists). The reset link in the email opens the **web** page `/auth/reset-password?token=…`; no in-app reset screen is needed. Phone-only accounts must contact the municipality (an admin sets a temporary password).
- Footer link to `/auth/signup`.

## i18n keys

`auth.login.{title,helper,email,emailPlaceholder,password,passwordPlaceholder,submit,success,forgotPassword,noAccount,signupCta,errors.invalid}`.
