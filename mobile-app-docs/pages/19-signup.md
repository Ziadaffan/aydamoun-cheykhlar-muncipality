# 19 — Signup

| | |
|---|---|
| **Route** | `/(auth)/signup` |
| **Web parity** | [src/app/auth/signup/page.tsx](../../src/app/auth/signup/page.tsx) → [SignUpPage.tsx](../../src/packages/auth/signup/SignUpPage.tsx) (broken into `SignUpCard`, `SignUpHeader`, `SignUpForm`, `SignUpFooter`) |
| **Auth** | Public (redirects to home if already logged in) |
| **API** | `POST /api/auth/signup`, then login (see [03-authentication.md](../03-authentication.md)) |

## Purpose

Create a new resident account. Either email or phone (or both) must be provided.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]                                │
├─────────────────────────────────────┤
│            ┌─────┐                  │
│            │ logo│                  │
│            └─────┘                  │
│       Create account                │
│       Welcome to the municipality   │
│                                     │
│  Full name *                        │
│  [_____________________________]    │
│                                     │
│  Email                              │
│  [_____________________________]    │
│  Helper: email or phone is required │
│                                     │
│  Phone                              │
│  [_____________________________]    │
│                                     │
│  Password *                         │
│  [••••••••••••••••••]   [👁]        │
│  Helper: min 6 characters           │
│                                     │
│  Confirm password *                 │
│  [••••••••••••••••••]   [👁]        │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  [          Sign up           ]     │
│                                     │
│  Already have an account? [Log in]  │
│                                     │
└─────────────────────────────────────┘
```

## Form

```ts
const phoneRegex = /^[0-9+\-\s]{6,20}$/;

const schema = yup.object({
  name: yup.string().trim().min(2, 'errors.name.short').max(50).required('errors.required'),
  email: yup.string().email('errors.email.invalid').nullable().notRequired(),
  phone: yup.string().matches(phoneRegex, 'errors.phone.invalid').nullable().notRequired(),
  password: yup.string().min(6).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'errors.passwordMismatch')
    .required(),
})
.test('at-least-one', 'errors.auth.atLeastOne', v => !!(v.email || v.phone));
```

Watch `password` to live-validate `confirmPassword` on each keystroke.

## Submit

```ts
const submit = useMutation({
  mutationFn: async (values) => {
    await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        password: values.password,
      }),
    });
    // Auto-login
    await auth.login({
      identifier: values.email || values.phone!,
      password: values.password,
    });
  },
  onSuccess: () => {
    showBanner('success', t('auth.signup.success'));
    setTimeout(() => router.replace('/home'), 800);
  },
  onError: (err) => {
    if (err.code === 'USER_EXISTS') showBanner('error', t('auth.signup.errors.exists'));
    else showBanner('error', err.message);
  },
});
```

## UX details

- Eye toggles on both password fields.
- "Phone" field uses `keyboardType="phone-pad"`.
- Submit button disabled until form valid; spinner while pending.
- Footer link to `/auth/login`.

## On mount

If already logged in, `router.replace('/home')`.

## i18n keys

`auth.signup.{title,subtitle,fullName,fullNamePlaceholder,email,emailPlaceholder,phone,phonePlaceholder,password,passwordPlaceholder,confirmPassword,confirmPasswordPlaceholder,submit,success,haveAccount,loginCta,errors.exists}`.
