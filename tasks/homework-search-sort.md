# Homework: Search Bar + Sort Controls

## Goal

Add a search bar and sort dropdown above the card grid. Both should work via URL params
(same pattern as the filters you just built), triggering a server-side re-fetch.

---

## What You're Building

```
┌─────────────────────────────────────────────────────┐
│  [🔍 Search cards...________________]  [Sort ▾]     │
└─────────────────────────────────────────────────────┘
```

- **Search** — filters cards by name using a text input
- **Sort** — dropdown with 4 options: Name A→Z, Name Z→A, Number ↑, Number ↓

Searching or changing sort should immediately update the URL and re-fetch (no Apply button needed here — these are instant actions unlike multi-select filters).

---

## URL Params to Use

| Param | Example | Meaning |
|-------|---------|---------|
| `q` | `?q=pikachu` | Search by card name |
| `sort` | `?sort=name` | Sort field (`name` or `number`) |
| `dir` | `?dir=asc` | Sort direction (`asc` or `desc`) |

Default (no params): sorted by `created_at` descending (current behavior).

---

## Files to Touch

### 1. Create `components/browse/browse-toolbar.tsx`

This is currently empty. Build it as a `"use client"` component.

**Props it needs:**
```ts
type Props = {
  initialQuery?: string;
  initialSort?: string;
  initialDir?: string;
};
```

**Behavior:**
- Search input: on submit (Enter key or search button), push `q` to URL
- Sort dropdown: on selection, immediately push `sort` + `dir` to URL
- Use `useRouter`, `usePathname`, `useSearchParams` — same pattern as `FiltersPanel`
- When pushing sort params, preserve existing filter params (set, rarities, types, q)
- When pushing search, reset `page` to avoid empty results (same as Apply in FiltersPanel)

**Hint:** Look at how `handleApply` works in `FiltersPanel` — it seeds from `searchParams`
and surgically patches only the relevant params. Do the same here.

### 2. Update `app/page.tsx`

Add `q`, `sort`, `dir` to `searchParams` type:
```ts
searchParams: Promise<{
  q?: string;
  sort?: string;
  dir?: string;
  // ... existing params
}>
```

Parse them:
```ts
const searchQuery = searchParams.q ?? "";
const sortField = searchParams.sort ?? "created_at";   // default
const sortDir = searchParams.dir === "desc" ? false : true; // asc = true
```

Then apply to the Supabase query:

**Search** — add this after the existing filter chains:
```ts
if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);
```

**Sort** — replace the hardcoded `.order("created_at", { ascending: false })` with:
```ts
const orderColumn = sortField === "name" ? "name"
  : sortField === "number" ? "local_id"
  : "created_at";

query = query.order(orderColumn, { ascending: sortDir });
```

### 3. Render `BrowseToolbar` in `page.tsx`

Pass it into the `<section>` above `<CardGrid>`:

```tsx
import { BrowseToolbar } from "@/components/browse/browse-toolbar";

// in JSX:
<section className="flex flex-col gap-6 pt-11">
  <BrowseToolbar
    initialQuery={searchQuery}
    initialSort={sortField}
    initialDir={searchParams.dir ?? "asc"}
  />
  <CardGrid cards={cards ?? []} />
</section>
```

---

## Sort Dropdown Options

Map these user-facing labels to param values:

| Label | `sort` param | `dir` param |
|-------|-------------|-------------|
| Name A → Z | `name` | `asc` |
| Name Z → A | `name` | `desc` |
| Number ↑ | `number` | `asc` |
| Number ↓ | `number` | `desc` |

Use the existing shadcn `Select` component from `components/ui/select.tsx` for the dropdown.

---

## Hints & Gotchas

- `local_id` in the database is a **text** column (values like `"001"`, `"002"`), not a number.
  Sorting it alphabetically works fine for standard sets, but `"10"` sorts before `"9"`.
  This is acceptable for now — worth noting as a known limitation.

- The search input should be a **controlled input** that updates local state on every keystroke,
  but only pushes to the URL on Enter or a search button click. Don't push on every keystroke
  or you'll get a request per character typed.

- Preserve existing filter params when pushing sort/search. If a user has filtered by "Fire"
  types and then sorts, they shouldn't lose their type filter.

- shadcn `Select` is at `components/ui/select.tsx`. If it doesn't exist yet, you can check
  if it needs adding via `npx shadcn@latest add select`.

---

## How to Know It's Working

1. Type "pikachu" in search → URL becomes `?q=pikachu`, only Pikachu cards show
2. Change sort to "Name A → Z" → URL adds `?sort=name&dir=asc`, cards re-order
3. Combine: filter by Fire type (Apply) + search "char" → both params in URL, results filtered AND searched
4. Clear search (empty input, submit) → `q` param removed from URL
