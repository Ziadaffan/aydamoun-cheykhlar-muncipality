# aydamoun-cheykhlar-muncipality

## Environment variables

| Variable                                                                           | Purpose                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                     | Postgres (Prisma Accelerate) connection string                                                                                                                                                                                                                            |
| `NEXTAUTH_URL`                                                                     | Public site URL — also used to build password-reset links                                                                                                                                                                                                                 |
| `NEXTAUTH_SECRET`                                                                  | Signs NextAuth sessions and mobile Bearer tokens                                                                                                                                                                                                                          |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Media uploads                                                                                                                                                                                                                                                             |
| `RESEND_API_KEY`, `EMAIL_FROM`                                                     | Password-reset emails via [Resend](https://resend.com). `EMAIL_FROM` must be a verified sender, e.g. `بلدية عيدمون شيخلار <no-reply@yourdomain.com>`                                                                                                                      |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                         | Website "Continue with Google" (NextAuth Google provider). Web OAuth client; authorized redirect URI `<NEXTAUTH_URL>/api/auth/callback/google`. The button is hidden while either is unset.                                                                               |
| `GOOGLE_CLIENT_IDS`                                                                | App Google sign-in (`POST /api/auth/google`): comma-separated OAuth client ids accepted as the ID token audience (the web, iOS and Android client ids the app uses). `GOOGLE_CLIENT_ID` is accepted too. Without either the endpoint answers 503 `GOOGLE_NOT_CONFIGURED`. |
| `EXPO_ACCESS_TOKEN` (optional)                                                     | Only if "enhanced push security" is enabled in the Expo project                                                                                                                                                                                                           |

## Password reset

- Users with an email: `/auth/forgot-password` → email link → `/auth/reset-password?token=…` (link valid 1 hour, single use).
- Users registered with a phone number only: an admin sets a temporary password from `/admin/users`.

## Google sign-in

- Website: `/auth/login` and `/auth/signup` show "Continue with Google" when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- App: sends the Google ID token to `POST /api/auth/google` and gets `{ token, user, isNew }`.
- Both match the Google account to an existing user by email (Google-verified addresses only) and link it, or create a new user without a password (`user.hasPassword: false`).

## Admin sections

`/admin/announcements` (push to the app on publish), `/admin/services` (services and their request-form fields), `/admin/council` and `/admin/history` (shown on `/about-us`).
