# 04 — Navigation structure

## Top-level shape

The web app uses a top nav-bar + footer. On mobile, fold that into:

- **Bottom tab bar** for primary destinations (4 tabs).
- **Drawer** opened from a header hamburger for secondary destinations + Account.
- **Stack** inside each tab for detail screens.

```
RootLayout (Drawer)
├── (tabs)                              ← bottom tab bar
│   ├── home                            → Home screen
│   ├── news/                           → News stack (list + [id])
│   ├── services/                       → Services stack (list + forms/[serviceId] + submission-success)
│   └── more                            → "More" landing with cards for everything else
│
├── jobs                                → Jobs stack
├── documents                           → Documents list
├── associations                        → Associations stack
├── taxi-stops                          → Taxi stops list
├── about-us                            → About Us
├── (auth)                              ← non-tab, no drawer when logged out
│   ├── login
│   └── signup
└── (account)                           ← drawer entries, require auth
    ├── profile
    ├── profile/edit
    ├── profile/change-password
    └── profile/submissions/[id]/edit
```

## Tab definitions

| Tab | Icon | Label key | Initial route |
|---|---|---|---|
| Home | `Home` | `nav.home` | `/home` |
| News | `Newspaper` | `nav.news` | `/news` |
| Services | `Wrench` | `nav.services` | `/services` |
| More | `Menu` | `nav.more` | `/more` |

## Drawer items

Top → bottom:

1. **Header** — logo + app title + (logged in ? name + email : "Log in" button)
2. Home
3. News
4. Services
5. Jobs
6. Documents
7. Associations
8. Taxi stops
9. About us
10. **Account section** (only when logged in)
    - Profile
    - Change password
    - Log out
11. **Legal section**
    - Privacy policy
    - Terms of use
12. **Language switcher** — three pills (ar / en / fr)

## Expo Router file layout

```
app/
├── _layout.tsx                          # Drawer + i18n + theme + SessionProvider + QueryClientProvider
├── (tabs)/
│   ├── _layout.tsx                     # Tabs.Navigator
│   ├── home.tsx
│   ├── news/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── services/
│   │   ├── index.tsx
│   │   ├── forms/
│   │   │   └── [serviceId].tsx
│   │   └── submission-success.tsx
│   └── more.tsx
│
├── jobs/
│   ├── index.tsx
│   └── [id].tsx
├── documents/
│   └── index.tsx
├── associations/
│   ├── index.tsx
│   └── [id].tsx
├── taxi-stops/
│   └── index.tsx
├── about-us.tsx
│
├── (auth)/
│   ├── _layout.tsx                     # Hidden drawer/tabs
│   ├── login.tsx
│   └── signup.tsx
│
├── (account)/
│   ├── _layout.tsx                     # RequireAuth wrapper
│   ├── profile/
│   │   ├── index.tsx
│   │   ├── edit.tsx
│   │   ├── change-password.tsx
│   │   └── submissions/
│   │       └── [id]/edit.tsx
│
├── legal/
│   ├── privacy-policy.tsx
│   └── terms-of-use.tsx
└── +not-found.tsx
```

## Header behavior per stack

- **Tab-root screens** (home, news/index, services/index, more): drawer-burger on the start side; language switcher and avatar on the end side.
- **Detail screens** (news/[id], associations/[id], jobs/[id], forms/[serviceId], profile/edit, etc.): back chevron on the start side; screen title centered; optional action button on the end side.
- All stacks use the gradient background from [01-design-system.md](01-design-system.md).

## Deep links

For future-proofing (push notifications, share links), declare:

```ts
const linking = {
  prefixes: ['municipality://', 'https://municipality.example.com'],
  config: {
    screens: {
      '(tabs)/news/[id]': 'news/:id',
      '(tabs)/services/forms/[serviceId]': 'services/forms/:serviceId',
      'associations/[id]': 'associations/:id',
      'jobs/[id]': 'jobs/:id',
      '(auth)/login': 'auth/login',
      '(account)/profile': 'profile',
    },
  },
};
```

## Auth gating

Implemented inside `(account)/_layout.tsx` and `(tabs)/services/forms/[serviceId].tsx`:

```tsx
if (!user) return <Redirect href={`/auth/login?next=${pathname}`} />;
```

On successful login, read `?next` and `router.replace(next)`.
