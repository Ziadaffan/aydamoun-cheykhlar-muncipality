# Aydamoun Cheikh Lahr Municipality — Mobile App Spec

Specification for an **Expo React Native** mobile app that mirrors the public UI/UX and feature set of the existing Next.js web app, **excluding all admin features**. The mobile app consumes the existing Next.js REST API.

## How to read this

Start with the shared chapters in order, then drill into individual pages under [pages/](pages/). Every page doc is self-contained and lists the API endpoints it touches, validation rules, and a mobile-adapted screen layout.

## Shared chapters

1. [00-overview.md](00-overview.md) — Goal, in-scope / out-of-scope, recommended stack
2. [01-design-system.md](01-design-system.md) — Colors, typography, spacing, RTL, i18n
3. [02-api-integration.md](02-api-integration.md) — Base URL, all public endpoints, error model
4. [03-authentication.md](03-authentication.md) — Login/session strategy, **important NextAuth-on-mobile caveats**
5. [04-navigation-structure.md](04-navigation-structure.md) — Drawer + Stack navigators, deep links, protected routes

## Pages

Each page below maps 1:1 to a screen in the mobile app. Admin-only pages from the web app (`/news/create`, `/jobs/create`, `/admin/*`, etc.) are intentionally omitted.

| # | Screen | Auth | Path on web |
|---|--------|------|-------------|
| 01 | [Home](pages/01-home.md) | Public | `/` |
| 02 | [News List](pages/02-news-list.md) | Public | `/news` |
| 03 | [News Detail](pages/03-news-detail.md) | Public | `/news/[id]` |
| 04 | [Services List](pages/04-services-list.md) | Public | `/services` |
| 05 | [Service Form](pages/05-service-form.md) | Required | `/services/forms/[serviceId]` |
| 06 | [Submission Success](pages/06-submission-success.md) | Required | `/services/submission-success` |
| 07 | [Jobs List](pages/07-jobs-list.md) | Public | `/jobs` |
| 08 | [Jobs Detail](pages/08-jobs-detail.md) | Public | (new on mobile) |
| 09 | [Documents List](pages/09-documents-list.md) | Public | `/documents` |
| 10 | [Associations List](pages/10-associations-list.md) | Public | `/associations` |
| 11 | [Association Detail](pages/11-association-detail.md) | Public | `/associations/[id]` |
| 12 | [Taxi Stops List](pages/12-taxi-stops-list.md) | Public | `/taxi-stops` |
| 13 | [About Us](pages/13-about-us.md) | Public | `/about-us` |
| 14 | [Profile](pages/14-profile.md) | Required | `/profile` |
| 15 | [Edit Profile](pages/15-edit-profile.md) | Required | (subsection of `/profile`) |
| 16 | [Change Password](pages/16-change-password.md) | Required | `/profile/change-password` |
| 17 | [Edit Submission](pages/17-edit-submission.md) | Required | `/profile/edit-submission/[id]` |
| 18 | [Login](pages/18-login.md) | Public | `/auth/login` |
| 19 | [Signup](pages/19-signup.md) | Public | `/auth/signup` |
| 20 | [Privacy Policy](pages/20-privacy-policy.md) | Public | `/privacy-policy` |
| 21 | [Terms of Use](pages/21-terms-of-use.md) | Public | `/terms-of-use` |

## Out of scope (admin only — do NOT build)

- News create / edit / delete
- Jobs create / edit / delete
- Documents create / delete
- Associations create / edit / delete
- Taxi stops create / edit / delete
- Council members create / edit / delete
- Any view of other users' submissions
- Any route under `/admin/*`
