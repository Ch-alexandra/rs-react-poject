# Performance Report

## What is this app?

CO₂ Emissions Data Explorer — shows CO2 data for countries. You can search, filter by year, sort, and toggle columns.

---

## Phase 1: Before optimization (baseline)

I profiled the app using React DevTools Profiler in development mode.

### What I found

The app was slow because:
- Every time I typed in the search box, ALL 200+ country cards re-rendered
- Changing the year caused every single card and table to re-render
- Sorting re-ran the filter+sort on every render even if nothing changed
- Opening the column modal caused the whole tree to re-render
- `createYearDataMap()` was called on every render for every card (creates a new Map each time)
- All list items used `key={index}` which is bad practice

### Baseline numbers (from profiler)

| Action | Commit duration | Components re-rendered |
|--------|----------------|----------------------|
| Sort | ~150ms | 200+ |
| Search (per keystroke) | ~130ms | 200+ |
| Change year | ~180ms | 200+ |
| Toggle column | ~140ms | All |

Flame chart showed: `App → CountryList → CountryCard (×200+) → DataTable (×200+)` — everything re-rendered every time.

---

## Phase 2: Optimizations I applied

### useMemo

Used `useMemo` to avoid recalculating things on every render:

```tsx
// App.tsx - years list only recalculates when data changes
const years = useMemo(() => (data ? getAvailableYears(data) : []), [data]);

// CountryList - filter+sort only runs when relevant state changes
const filteredCountries = useMemo(() => {
  return countries.filter(...).sort(...);
}, [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYear]);

// CountryCard - yearDataMap only recreated when country data changes
const yearDataMap = useMemo(() => createYearDataMap(country.data), [country.data]);

// DataTable - find record only when data or year changes
const record = useMemo(() => data.find((d) => d.year === year), [data, year]);
```

### useCallback

Wrapped all event handlers in `useCallback` so they don't get recreated on every render:

```tsx
// Before
const handleSearch = (value: string) => {
  setState({ ...state, searchQuery: value });
};

// After
const handleSearch = useCallback((value: string) => {
  setState((prev) => ({ ...prev, searchQuery: value }));
}, []);
```

Applied to all 6 handlers in App.tsx.

### React.memo

Wrapped components so they skip re-rendering when their props didn't change:

- `SearchBar` — now won't re-render when year changes
- `YearSelector` — won't re-render when search changes
- `ColumnModal` — won't re-render unless it's open or columns changed
- `CountryCard` — won't re-render unless its country/year/columns changed
- `DataTable` — won't re-render unless data/year/columns changed

### Proper keys

```tsx
// Before (bad)
{columns.map((column, index) => <tr key={index}>...)}

// After (good)
{columns.map((column) => <tr key={column}>...)}
```

Also fixed country list to use `country.id` as key instead of index.

### Virtualization (react-window)

This was the biggest win. Instead of rendering all 200+ cards at once, now only ~3 visible cards are rendered:

```tsx
// Before: renders ALL countries
{filteredCountries.map((country) => <CountryCard key={country.id} ... />)}

// After: renders only visible ones
<List
  rowComponent={Row}
  rowCount={filteredCountries.length}
  rowHeight={280}
  rowProps={rowProps}
  style={{ height: 700 }}
/>
```

---

## Phase 3: After optimization

| Action | Before | After | Improvement |
|--------|--------|-------|-------------|
| Sort | ~150ms | ~15ms | ~90% faster |
| Search | ~130ms | ~10ms | ~92% faster |
| Change year | ~180ms | ~20ms | ~89% faster |
| Toggle column | ~140ms | ~5ms | ~96% faster |
| DOM nodes (cards) | 200+ | 3–5 | ~98% fewer |

The biggest improvement came from virtualization — instead of 200+ cards in the DOM, only 3-5 are rendered at any time. The second biggest was `React.memo` + `useCallback` which stopped the cascade of unnecessary re-renders.
