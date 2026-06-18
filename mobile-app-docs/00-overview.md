# 00 — Overview

## What we're building

A mobile companion app for the **Aydamoun Cheikh Lahr Municipality** that lets residents:

- Browse municipal news, services, jobs, documents, community associations, and taxi stops
- See council members and contact info
- Sign up / log in with email **or** phone
- Submit service requests (license applications, complaints, etc.) and track their status
- Edit their profile, change password, and edit/delete their own submissions

The app reuses the existing Next.js REST API. No business logic lives on the device beyond form validation and presentation.

## Out of scope

Everything that requires an `ADMIN` role:

- Creating / editing / deleting news, jobs, documents, associations, taxi stops
- Viewing or moderating other users' submissions
- Managing council members
- The entire `/admin` web area

In short: **read everything, mutate only your own user data and your own service submissions.**

## Recommended stack

| Concern | Choice | Why |
|---|---|---|
| App framework | **Expo SDK (latest)** | Per user's request |
| Language | TypeScript | Match web app, share types |
| Navigation | **Expo Router** (file-based) | Matches Next.js mental model and the route table in this spec |
| Data fetching | **@tanstack/react-query** | Web app already uses it; cache + retry + invalidation come free |
| Forms | **react-hook-form + yup** | 1:1 with web; reuse the schemas in [src/packages/auth/validation/](../src/packages/auth/validation/) |
| HTTP | `fetch` wrapped in a small `apiClient` (see [02-api-integration.md](02-api-integration.md)) | Tiny, no extra dep |
| Auth storage | **expo-secure-store** | Holds the session cookie / token between launches |
| i18n | **i18next + react-i18next** | Same as web; reuse `/public/language/*.json` |
| RTL | `I18nManager.forceRTL(true)` + per-language toggle | Default language is Arabic |
| Images | `expo-image` + Cloudinary URLs (already in API responses) | Caching + transforms |
| Maps | `react-native-maps` (Google/Apple) | Cheaper than embedding Leaflet; only used on Home contact section |
| File pickers | `expo-document-picker`, `expo-image-picker` | For service-form uploads |
| File preview / download | `expo-file-system` + `expo-sharing` | To download documents (PDFs) |
| Phone / email links | `Linking.openURL('tel:…' / 'mailto:…')` | Replaces clickable `tel:` anchors |

## Hard requirements that touch architecture

- **RTL first.** Default locale is Arabic. Build every screen layout assuming `I18nManager.isRTL === true`. Cross-check with English and French.
- **Email-or-phone authentication.** The `identifier` field can be either. See [03-authentication.md](03-authentication.md).
- **Locale-aware date and time formatting** — use `date-fns` with the same locale files the web app uses.
- **Cloudinary content** in `imageUrl`/`picaURL`/`image` fields can be either a Cloudinary URL **or** a base64 data URI. Components must handle both.
