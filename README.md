# aydamoun-cheykhlar-muncipality

## Environment variables

| Variable                                                                           | Purpose                                                                                                                                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                     | Postgres (Prisma Accelerate) connection string                                                                                                       |
| `NEXTAUTH_URL`                                                                     | Public site URL — also used to build password-reset links                                                                                            |
| `NEXTAUTH_SECRET`                                                                  | Signs NextAuth sessions and mobile Bearer tokens                                                                                                     |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Media uploads                                                                                                                                        |
| `RESEND_API_KEY`, `EMAIL_FROM`                                                     | Password-reset emails via [Resend](https://resend.com). `EMAIL_FROM` must be a verified sender, e.g. `بلدية عيدمون شيخلار <no-reply@yourdomain.com>` |

## Password reset

- Users with an email: `/auth/forgot-password` → email link → `/auth/reset-password?token=…` (link valid 1 hour, single use).
- Users registered with a phone number only: an admin sets a temporary password from `/admin/users`.
