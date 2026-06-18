# 09 — Documents list

| | |
|---|---|
| **Route** | `/documents` |
| **Web parity** | [src/app/documents/page.tsx](../../src/app/documents/page.tsx) → [DocumentsPage.tsx](../../src/packages/document/component/DocumentsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/documents` |

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
