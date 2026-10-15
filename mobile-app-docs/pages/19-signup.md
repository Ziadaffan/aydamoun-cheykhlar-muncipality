# 19 — Signup

|                |                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route**      | `/(auth)/signup`                                                                                                                                                                                  |
| **Web parity** | [src/app/auth/signup/page.tsx](../../src/app/auth/signup/page.tsx) → [SignUpPage.tsx](../../src/packages/auth/signup/SignUpPage.tsx) (`SignUpCard`, `SignUpHeader`, `SignUpForm`, `SignUpFooter`) |
| **Auth**       | Public (closes itself if already logged in)                                                                                                                                                       |
| **API**        | `POST /api/auth/signup`, then `POST /api/auth/mobile-login` (see [02-api-integration.md](../02-api-integration.md#auth))                                                                          |

## Purpose

Create a resident account. Email or phone (or both) must be given.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  إنشاء حساب                    │
├─────────────────────────────────────┤
│            logo                     │
│       إنشاء حساب جديد               │
│       أهلاً بك في بلدية عيدمون شيخلار │
│  ▮ MessageBanner (+ login / forgot) │
│  الاسم الكامل *                     │
│  البريد الإلكتروني  (helper: one of) │
│  رقم الهاتف                         │
│  كلمة المرور *  (helper: the rule)  │
│  تأكيد كلمة المرور *                │
│  [          إنشاء حساب          ]   │
│  بإنشاء حساب، فإنك توافق على        │
│  [شروط الاستخدام] و[سياسة الخصوصية] │
│  لديك حساب بالفعل؟ [تسجيل الدخول]   │
└─────────────────────────────────────┘
```

## Form (`signupSchema`, `features/auth/validation.ts`)

Same rules as the website's `auth.validation.ts` and the server:

- `name`: required, trimmed, 2–50 characters.
- `email` / `phone`: optional, a blank field counts as absent (sent as `null`); at least one is required, reported on the email field (`errors.atLeastOne`). Emails trimmed; phones normalized (`lib/phone.ts`) and 6–15 digits.
- `password`: the [password rule](../02-api-integration.md#password-rule): 6+ characters with a lower-case letter, an upper-case letter and a digit (`errors.password.min`, `errors.password.pattern`). iOS `passwordRules` make generated passwords meet it.
- `confirmPassword`: must match.

Mode `onTouched`; dependent errors (confirmation, "email or phone") wait until that field was visited or the form submitted.

## Submit

`useSession().signup(input)`: `POST /api/auth/signup`, then logs in with the email (else the phone).

- Account exists: `409 USER_EXISTS` (current API) or `400 "User with this email or phone already exists"` (older deployments) → `auth.signup.errors.exists` with «تسجيل الدخول» (identifier prefilled) and «نسيت كلمة المرور؟» actions.
- `SignupLoginError` (created, automatic login failed) → login screen with the identifier prefilled and «تم إنشاء حسابك، سجّل الدخول».
- Other errors → `userMessage(err)` (`WEAK_PASSWORD`, `INVALID_PHONE`, `EMAIL_OR_PHONE_REQUIRED` have their own Arabic text).
- Success → toast, then `leaveAuth(next)` (see [18-login.md](18-login.md#navigation-featuresauthnavigationts)).

## Consent line

«بإنشاء حساب، فإنك توافق على شروط الاستخدام وسياسة الخصوصية». The two links open the website's `/terms-of-use` and `/privacy-policy` (the same text as the app's legal pages) in an in-app browser (`openLegalPage()` in `features/auth/navigation.ts`, `expo-web-browser`), so the typed form stays as it is. Pushing the app's `/(tabs)/legal/*` from the auth stack would mount a second tabs navigator. Offline → `errors.network` toast. The website's signup form shows the same line (`auth.signup.consent.*`).

## i18n keys

`auth.signup.{title,subtitle,name,email,phone,password,confirmPassword,emailOrPhoneHelper,passwordHelper,submit,submitting,success,hasAccount,login,errors.exists,consent,consentAnd}`, `nav.termsOfUse`, `nav.privacyPolicy`.
