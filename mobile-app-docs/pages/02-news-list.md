# 02 — News list

| | |
|---|---|
| **Route** | `/(tabs)/news` |
| **Web parity** | [src/app/news/page.tsx](../../src/app/news/page.tsx) → [NewsPage.tsx](../../src/packages/news/components/NewsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/news`, `GET /api/news/featured`, `GET /api/news/categories` |

## Purpose

Browse municipality news. Filter by category. Toggle grid/list view.

## Screen layout

```
┌─────────────────────────────────────┐
│  [≡]  News               [globe]    │
├─────────────────────────────────────┤
│                                     │
│  ┌──── Featured hero ─────────┐     │
│  │  <image>                   │     │
│  │  [category badge]          │     │
│  │  Title (large)             │     │
│  │  Excerpt…                  │     │
│  │  📅 date · ✍ author        │     │
│  └────────────────────────────┘     │
│                                     │
│  ┌────────────────────────────┐     │
│  │  All news       [▦] [≡]   │     │
│  └────────────────────────────┘     │
│                                     │
│  Category pills (horizontal scroll) │
│  [All] [Municipal] [Projects] [..]  │
│                                     │
│  3 news in "Announcements"          │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ <img>    │  │ <img>    │         │  Grid view (2 cols)
│  │ Title    │  │ Title    │         │
│  │ Excerpt  │  │ Excerpt  │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐                       │
│  │ <img>    │                       │
│  │ Title    │                       │
│  └──────────┘                       │
└─────────────────────────────────────┘
```

In **list view**, swap the grid for a single column of wide cards: thumbnail on the start side, title + excerpt + meta on the end side.

## Data fetching

```ts
const featured = useQuery({ queryKey: ['news', 'featured'], queryFn: () => api<News>('/api/news/featured') });
const categories = useQuery({ queryKey: ['news', 'categories'], queryFn: () => api<NewsCategory[]>('/api/news/categories') });
const news = useQuery({
  queryKey: ['news', { category: selectedCategory }],
  queryFn: () => api<News[]>(
    selectedCategory === 'ALL' ? '/api/news' : `/api/news?category=${selectedCategory}`
  ),
});
```

## State

```ts
type ViewMode = 'grid' | 'list';
const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
const [viewMode, setViewMode] = useState<ViewMode>('grid');
```

Persist `viewMode` in `AsyncStorage` so the user's last pick survives restarts.

## Components

### Featured hero card

- Top-most. Hidden if `featured.data` is null.
- Tap → `router.push(\`/news/${featured.data.id}\`)`.
- Image fills 16:9; gradient bottom overlay; title in white.

### View toggle row

Two icon buttons (`Grid`, `List`); the active one filled (`bg-blue-600 text-white`), the other muted (`bg-gray-200 text-gray-600`).

### Category pills

Horizontal `<FlatList horizontal showsHorizontalScrollIndicator={false}>`. Items:

```ts
const all = [{ id: 'ALL', label: t('news.categories.all') }, ...categories.data.map(c => ({ id: c, label: t(`news.categories.${c}`) }))];
```

Selected pill: `bg-primary text-white`. Idle: `bg-surfaceMuted text-text`.

### News card

| Field | Source |
|---|---|
| Image | `imageUrl[0]` via `<CldImage>` — fallback placeholder |
| Category badge | `<Badge>` colored by category |
| Title | `title`, 2 lines max with ellipsis |
| Excerpt | `excerpt`, 3 lines max |
| Meta | `date-fns format(createdAt)` · `author` · 👁 `views` |

Tap → `router.push(\`/news/${id}\`)`.

### Empty state

If `news.data?.length === 0`:

```
<EmptyState
  icon={Newspaper}
  title={t('news.empty.title')}
  body={t('news.empty.body')}
/>
```

### Loading / error

- Loading: spinner overlay until both `featured` and `news` settle (categories can stream in).
- Error: `<ErrorState onRetry={refetch} />`.

## Pull-to-refresh

Yes. `<FlatList refreshControl={<RefreshControl refreshing={news.isRefetching} onRefresh={news.refetch} />}>`. Also refetch `featured` and `categories`.

## i18n keys

`news.page.title`, `news.page.allNews`, `news.page.newsCount`, `news.page.newsCountInCategory`, `news.categories.<ENUM>`, `news.empty.{title,body}`.

## Excluded from web parity

Web shows an "Admin: Create News" button when role is `ADMIN`. Skip — admin out of scope.
