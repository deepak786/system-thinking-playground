# RAG Fundamentals

Five-part interactive series on how ChatGPT answers questions about a PDF
(retrieval-augmented generation).

## Episodes

Declared in `demoRegistry.ts` as one entry with a nested `demos` array
(array order = Part number). Presence of `demos` makes it a series hub.

| Part | Folder | Route |
|------|--------|-------|
| 1 | `chatgpt-pdf/` | `/rag-fundamentals/chatgpt-pdf` |
| 2 | `pdf-chunking/` | `/rag-fundamentals/pdf-chunking` |
| 3 | `pdf-retrieval/` | `/rag-fundamentals/pdf-retrieval` |
| 4 | `pdf-context/` | `/rag-fundamentals/pdf-context` |
| 5 | `pdf-generation/` | `/rag-fundamentals/pdf-generation` |

Hub: `/rag-fundamentals` — lists `demos`.

## Adding another series later

1. Create `src/demos/<series-id>/` and put episode folders inside it.
2. Add `{ id: '<series-id>', demos: […], … }` to `demoRegistry`.
3. Home, Sidebar, hub, and routes wire up automatically.
