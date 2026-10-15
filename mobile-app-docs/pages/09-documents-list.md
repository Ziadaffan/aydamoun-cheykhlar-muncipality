# 09 — Documents list

| | |
|---|---|
| **Route** | `/documents` |
| **Web parity** | [src/app/documents/page.tsx](../../src/app/documents/page.tsx) → [DocumentsPage.tsx](../../src/packages/document/component/DocumentsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/documents` |

## Current behaviour (release 1.2)

The sections below describe the original port; where they differ, this list wins.

- Single-column list with search (shared `SearchField` / `lib/search` over title, description and type).
- `fileUrl` is an absolute URL on the current backend: `GET /api/documents` returns `https://…/api/documents/<id>/file` for uploads (stored as base64 in the database) and keeps real http(s) URLs as they are. `GET /api/documents/<id>/file` is public: base64 rows are served as the file (Content-Type from the extension, Content-Length, `Content-Disposition: inline` with the title, `Cache-Control: public, max-age=3600`, ETag); http(s) rows are a 302 redirect; unknown id → 404 `DOCUMENT_NOT_FOUND`.
- Older backends still embed base64 in `fileUrl`; the app handles both.
- Open: images in the in-app `ImageViewer`; iOS opens URL documents in the in-app Safari sheet; Android downloads once into the cache (progress, cancel) and opens with `ACTION_VIEW` + read permission. Share is a separate icon button.
- The website's document card uses the URL directly (data: URI fallback for old responses).

## Purpose

Browse and download official municipal documents (PDFs, forms, etc).

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Documents                     │
├─────────────────────────────────────┤
│                                     │
│  H2  Official documents             │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │  📄 PDF  │  │  📄 DOCX │         │
│  │  Title   │  │  Title   │         │
│  │  Descr.  │  │  Descr.  │         │
│  │ [⬇ Open] │  │ [⬇ Open] │         │
│  └──────────┘  └──────────┘         │
│  …                                  │
│                                     │
└─────────────────────────────────────┘
```

2-col grid on mobile.

## Data fetching

```ts
const { data } = useQuery({
  queryKey: ['documents'],
  queryFn: () => api<Document[]>('/api/documents'),
});
```

## `DocumentCard`

| Field | Source |
|---|---|
| Icon | Map `document.type` → file icon: `pdf` → 📄 red, `doc`/`docx` → 📄 blue, `xls`/`xlsx` → 📊 green, else generic |
| Title | `document.title` |
| Description | `document.description` (max 2 lines) |
| Action | "Open / Download" button |

## Download action

```ts
async function openDocument(doc: Document) {
  const target = FileSystem.cacheDirectory + `${doc.id}.${doc.type}`;
  try {
    const { uri } = await FileSystem.downloadAsync(doc.fileUrl, target);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      await Linking.openURL(doc.fileUrl);
    }
  } catch {
    await Linking.openURL(doc.fileUrl); // fallback
  }
}
```

Show a small spinner overlay on the card while downloading.

## States

- Loading → `<LoadingScreen>`.
- Empty → `<EmptyState icon={FileText}>`.
- Error → `<ErrorState onRetry />`.

## Excluded

Create / delete (admin only).
