# 03 — News detail

| | |
|---|---|
| **Route** | `/(tabs)/news/[id]` |
| **Web parity** | [src/app/news/[id]/page.tsx](../../src/app/news/[id]/page.tsx) → [NewPage.tsx](../../src/packages/news/components/[id]/components/NewPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/news/[id]` |

## Current behaviour (release 1.2)

The sections below describe the original port; where they differ, this list wins.

- Opens instantly from the cached list item, then loads the body. Plain-text bodies (the website's admin form is a textarea) keep their paragraphs and line breaks; the website article page now does the same (`whitespace-pre-line`) and no longer italicises the excerpt.
- Shared links are `https://aydamoun-cheykhlar-municipality.org/news/<id>`; with the app installed they open this screen, otherwise the website's article page (which now shows «هذا الخبر غير متاح…» for a deleted article instead of spinning).
- Images: Cloudinary URLs (new and migrated articles) or legacy base64; the website serves Cloudinary images through Cloudinary's own resizing (`newsImageLoader`), not Vercel's image optimizer.

## Purpose

Read a full news article. The API call increments `views` server-side.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  News                          │
├─────────────────────────────────────┤
│  ┌──────── Image carousel ────────┐ │
│  │   • • •                        │ │  paged horizontal scroll
│  └────────────────────────────────┘ │
│                                     │
│  [Category badge]  · 📅 May 12 2026 │
│  Title (h1)                         │
│  ✍ author · 👁 1.2k views           │
│                                     │
│  ─── divider ───                    │
│                                     │
│  Body content (rendered HTML)       │
│  Lorem ipsum dolor sit amet…        │
│                                     │
│  Tags: [#road] [#repair] [#south]   │
│                                     │
│  ┌── Share / Open in browser ──┐    │
│  └────────────────────────────┘     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { id } = useLocalSearchParams<{ id: string }>();
const { data: article, isLoading, error } = useQuery({
  queryKey: ['news', id],
  queryFn: () => api<News>(`/api/news/${id}`),
});
```

## Components

### Image carousel

`<FlatList horizontal pagingEnabled data={article.imageUrl}>`. Each item: `<CldImage>` at full width × 240. Dots indicator below.

If `imageUrl.length === 0`, render a tinted placeholder.

### Header

- Category badge (same component as list).
- Date (`date-fns` localized) on the same row, separator dot.
- Title `<Text style={textStyles.h1}>`.
- Author + views row.

### Body

The web stores `content` as **HTML**. Render with `react-native-render-html`:

```tsx
import RenderHtml from 'react-native-render-html';
<RenderHtml
  source={{ html: article.content }}
  contentWidth={width - 32}
  baseStyle={{ fontSize: 16, lineHeight: 26, color: colors.text }}
/>
```

Strip `<script>`/`<style>` tags defensively.

### Tags

Horizontal `<FlatList>` of pill chips. Tapping a tag goes back to `/news?tag=<tag>` if you wire tag filtering (optional; not in current API).

### Footer actions

- **Share** → `Share.share({ message: \`${article.title} — ${BASE}/news/${id}\` })`
- **Open in browser** → `Linking.openURL(\`${BASE}/news/${id}\`)`

## Loading / error / 404

- Loading: `<LoadingScreen />`.
- Error: `<ErrorState onRetry={refetch} />`.
- 404 (server returned `{ error: 'News not found' }`): render `<EmptyState icon={AlertCircle} title="…" body="…" />`.

## Excluded from web parity

Edit / delete buttons (admin only).
