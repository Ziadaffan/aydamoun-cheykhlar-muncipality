# 01 — Design system

The web app uses Tailwind v4 with Geist + Amiri + Baloo Bhaijaan 2. Below is the mobile-ready translation. Define these once in a `theme.ts` and feed them through context (or `nativewind` / `tamagui` / `restyle` — pick one and stick with it).

## 1. Color tokens

```ts
export const colors = {
  // Brand
  primary:        '#3b82f6',  // tailwind blue-500
  primaryDark:    '#2563eb',  // blue-600
  primaryLight:   '#60a5fa',  // blue-400 — CTA on hero
  accent:         '#22c55e',  // green-500
  accentLight:    '#bbf7d0',  // green-200 (nav gradient start)

  // Backgrounds
  bg:             '#ffffff',
  bgMuted:        '#f9fafb',  // gray-50
  bgGradientFrom: '#eff6ff',  // blue-50
  bgGradientTo:   '#f0fdf4',  // green-50
  navGradientFrom:'#bbf7d0',  // green-200
  navGradientTo:  '#93c5fd',  // blue-300
  surface:        '#ffffff',
  surfaceMuted:   '#f3f4f6',  // gray-100

  // Text
  text:           '#111827',  // gray-900
  textMuted:      '#4b5563',  // gray-600
  textSubtle:     '#9ca3af',  // gray-400
  textOnPrimary:  '#ffffff',

  // Borders
  border:         '#e5e7eb',  // gray-200
  borderStrong:   '#d1d5db',  // gray-300

  // Status (used on submission status badges)
  statusPending:    { bg: '#fef3c7', text: '#92400e' }, // yellow
  statusInProgress: { bg: '#dbeafe', text: '#1e40af' }, // blue
  statusCompleted:  { bg: '#d1fae5', text: '#065f46' }, // green
  statusRejected:   { bg: '#fee2e2', text: '#991b1b' }, // red

  // Footer
  footer:         '#1f2937',  // gray-800
};
```

Use `<LinearGradient colors={[colors.bgGradientFrom, colors.bgGradientTo]} />` from `expo-linear-gradient` for the page background that wraps News, Services, Jobs, etc.

## 2. Typography

```ts
export const fonts = {
  body:    'Geist-Regular',         // expo-google-fonts/geist
  bodyBold:'Geist-Bold',
  heading: 'BalooBhaijaan2-Bold',   // expo-google-fonts/baloo-bhaijaan-2
  arabic:  'Amiri-Regular',         // expo-google-fonts/amiri
  arabicBold: 'Amiri-Bold',
  mono:    'GeistMono-Regular',
};

export const textStyles = {
  h1:      { fontFamily: fonts.heading, fontSize: 32, lineHeight: 40 },
  h2:      { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32 },
  h3:      { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 26 },
  body:    { fontFamily: fonts.body,    fontSize: 16, lineHeight: 24 },
  bodySm:  { fontFamily: fonts.body,    fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.body,    fontSize: 12, lineHeight: 16, color: '#6b7280' },
  button:  { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 20 },
};
```

When the active locale is `ar`, swap `fonts.body`/`fonts.bodyBold` to `fonts.arabic`/`fonts.arabicBold` globally via a theme provider.

## 3. Spacing & radii

```ts
export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64,
};
export const radii = { sm: 6, md: 10, lg: 14, xl: 20, '2xl': 28, pill: 999 };
export const shadow = {
  card: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
};
```

## 4. Components

All reusable primitives the spec relies on. Build them once.

| Component | Notes |
|---|---|
| `<Screen>` | Wraps every page: `SafeAreaView` + `ScrollView`/`FlatList` + bottom-tab padding + RTL direction |
| `<GradientScreen>` | `<Screen>` with the blue-50 → green-50 gradient background |
| `<Header>` | Title + optional back button. Hidden on tab-root screens (drawer button there instead) |
| `<Card>` | white bg, `radii.lg`, `shadow.card`, padding `lg` |
| `<Button>` | variants: `primary` (blue gradient), `secondary` (gray-100), `ghost`, `danger`; sizes: `sm`, `md`, `lg`; loading state with spinner |
| `<InputText>` | Label, optional helper text, error message, RTL-aware text alignment |
| `<InputPassword>` | InputText + show/hide eye |
| `<InputPhone>` | Numeric keyboard, formats spaces |
| `<InputTextarea>` | Multi-line variant |
| `<InputFile>` | Wraps `expo-document-picker`; shows filename + remove button |
| `<InputImage>` | Wraps `expo-image-picker`; shows thumbnail + remove button; supports `multi` |
| `<StatusBadge status="PENDING">` | Pill with status color from tokens |
| `<EmptyState icon title body action?>` | Used on every list when array is empty |
| `<LoadingScreen>` / `<InlineSpinner>` | Centered `ActivityIndicator` with tinted color |
| `<ErrorState onRetry>` | For react-query error states |
| `<MessageBanner type="success"|"error">` | Dismissible inline alert (top of forms) |
| `<MapView>` | Wraps `react-native-maps`; takes lat/lng + zoom |
| `<CldImage src>` | Wraps `expo-image`, accepts Cloudinary URL or `data:` URI |
| `<LanguageSwitcher>` | Three buttons (ar / en / fr); persists via AsyncStorage + reloads i18n |
| `<AuthBanner>` | "Log in to use this feature" prompt shown on protected screens when guest |

## 5. RTL handling

```ts
import { I18nManager } from 'react-native';

// At app start, after detecting saved locale:
const shouldBeRTL = locale === 'ar';
if (I18nManager.isRTL !== shouldBeRTL) {
  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);
  // Requires a reload — Updates.reloadAsync()
}
```

- All `flexDirection: 'row'` automatically flips. Use `start`/`end` instead of `left`/`right` for icons and arrows.
- Back-button chevron must reverse: use `chevron-end` (lucide doesn't ship it natively — pick the icon at runtime: `I18nManager.isRTL ? 'chevron-right' : 'chevron-left'`).
- Numbers and times in Arabic stay LTR — wrap them in `<Text style={{ writingDirection: 'ltr' }}>` when needed.

## 6. i18n

- Reuse the existing JSON files at [/public/language/ar.json](../public/language/ar.json), `en.json`, `fr.json`. Copy them into `app/locales/` or load them remotely from the Next.js host (the same domain serves them).
- Library: `i18next` + `react-i18next` (already mirrored from web).
- Default locale: **Arabic**.
- Detection order: AsyncStorage saved choice → device locale → `ar`.

Key namespaces referenced by the web app (used throughout the page docs):

- `home.hero.*`, `home.services.cards.*.title`, `home.contact.info.*`
- `news.page.*`, `news.categories.*`
- `services.formInstructions`, `services.categories.*`
- `auth.login.*`, `auth.signup.*`
- `profile.*`, `profile.submissions.*`
- `footer.privacyPolicy`, `footer.termsOfUse`, `footer.copyright`

## 7. Icons

Use **lucide-react-native** (same icon family the web app uses via lucide-react). Common icons:

`Home, Newspaper, Wrench, Briefcase, FileText, Users, MapPin, Info, User, ChevronLeft, ChevronRight, Search, Filter, Grid, List, Phone, Mail, Clock, Calendar, Eye, Edit2, Trash2, Plus, X, Check, AlertCircle`

## 8. Image sources

- Logo: `https://res.cloudinary.com/<cloud>/image/upload/v.../logo_smzpb2.png`
- Hero background: bundle locally as `assets/images/bg-2.jpg` (web has it at [/public/assets/images/bg-2.jpg](../public/assets/images/bg-2.jpg))
- Any `imageUrl[]`, `picaURL`, `image`, `fileUrl` field from the API → pass straight to `<CldImage>`.
