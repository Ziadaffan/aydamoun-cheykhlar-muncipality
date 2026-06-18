# 01 — Home

| | |
|---|---|
| **Route** | `/home` (tab root) |
| **Web parity** | [src/app/page.tsx](../../src/app/page.tsx) → [HomePage.tsx](../../src/packages/home/components/HomePage.tsx) |
| **Auth** | Public |
| **API** | None — static |

## Purpose

Landing screen showing the municipality identity, links to top-level services, and contact info. Sets first-impression tone.

## Screen layout (top → bottom)

```
┌─────────────────────────────────────┐
│  [≡]               [globe] [user]    │  Header
├─────────────────────────────────────┤
│                                     │
│   <Hero background image>           │
│                                     │
│   H1  home.hero.title               │
│       home.hero.subtitle            │
│                                     │
│   [ Explore services ▸ ]            │
│                                     │
├─────────────────────────────────────┤
│  H2  Our services                   │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ 🏗️       │  │ 🌱      │         │  2-col grid on mobile
│  │ Building │  │ Environ. │         │
│  │ Licenses │  │ Services │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │ 📅       │  │ 📄      │         │
│  │ Admin    │  │ Forms    │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │ 📢       │  │ ⭐       │         │
│  │ Complain.│  │ Other    │         │
│  └──────────┘  └──────────┘         │
│                                     │
├─────────────────────────────────────┤
│  H2  Get in touch                   │
│  ─── gradient underline ───         │
│                                     │
│  ┌─ ⏱  Hours ─────────┐             │
│  │  Mon–Fri 8am–4pm   │             │
│  └────────────────────┘             │
│  ┌─ 📞 Phone ────────┐              │
│  │  +961 …            │             │
│  └────────────────────┘             │
│  ┌─ ✉️ Email ────────┐              │
│  │  info@…            │             │
│  └────────────────────┘             │
│                                     │
│  ┌───── Map view ─────┐             │
│  │       📍           │             │
│  └────────────────────┘             │
│                                     │
└─────────────────────────────────────┘
```

## Sections

### 1. Hero

- Full-bleed background image: bundled local asset (web copy at `/public/assets/images/bg-2.jpg`).
- Dim overlay (`rgba(0,0,0,0.35)`) for text legibility.
- `<Text style={textStyles.h1}>` for `t('home.hero.title')`.
- `<Text style={textStyles.body}>` for `t('home.hero.subtitle')`.
- CTA `<Button variant="primary" size="lg">` — text `t('home.hero.ctaButton')` → `router.push('/services')`.

### 2. Services overview grid

Static data — **not** fetched from API.

```ts
const SERVICE_CARDS = [
  { titleKey: 'home.services.cards.buildingLicense.title',           emoji: '🏗️', route: '/services?anchor=buildingLicenses' },
  { titleKey: 'home.services.cards.environmentalServices.title',     emoji: '🌱', route: '/services?anchor=environmentalServices' },
  { titleKey: 'home.services.cards.administrativeTransactions.title',emoji: '📅', route: '/services?anchor=administrativeTransactions' },
  { titleKey: 'home.services.cards.officialForms.title',             emoji: '📄', route: '/services?anchor=officialForms' },
  { titleKey: 'home.services.cards.complaintsAndSuggestions.title',  emoji: '📢', route: '/services?anchor=complaintsAndSuggestions' },
  { titleKey: 'home.services.cards.additionalServices.title',        emoji: '⭐', route: '/services?anchor=additionalServices' },
];
```

- 2-column grid on mobile (web uses 3 on desktop).
- Each card: `<Card>` with emoji (large, centered), title underneath, ripple/press feedback.
- Tap navigates to `/services` and scrolls to the matching category section.

### 3. Contact section

- H2 `t('home.contact.title')` + gradient underline (`LinearGradient` from blue-500 → green-500, height 4, width 80, alignSelf center).
- Stack of three info cards (icon + label + value) — glassmorphic on web; on mobile, plain white card with `shadow.card`.
- Tap behavior:
  - Phone card → `Linking.openURL('tel:+961…')`
  - Email card → `Linking.openURL('mailto:…')`
  - Hours card — non-interactive
- Map at the bottom: `<MapView>` with a marker at the municipality coordinates. Static `region`. Locked / pinch disabled by default; tap to open in system Maps.

## State

None — static.

## Interactions

| Element | Action |
|---|---|
| Hero CTA | `router.push('/services')` |
| Service card | `router.push(card.route)` |
| Phone card | `Linking.openURL('tel:…')` |
| Email card | `Linking.openURL('mailto:…')` |
| Map | `Linking.openURL('https://maps.google.com/?q=lat,lng')` |

## Edge cases

- If the bundled hero image fails to load, fall back to `colors.bgGradientFrom → colors.bgGradientTo` gradient.
- Permission for map: none needed since we're not showing user location.

## i18n keys

`home.hero.title`, `home.hero.subtitle`, `home.hero.ctaButton`, `home.services.title`, `home.services.cards.*.title`, `home.contact.title`, `home.contact.info.timing.{title,value}`, `home.contact.info.phone.{title,value}`, `home.contact.info.email.{title,value}`.
