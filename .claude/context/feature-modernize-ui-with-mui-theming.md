# Abzu UI Modernization

Stop Place Registry app modernizing UI with dual-app architecture. **Core goal: fully responsive design** supporting mobile, tablet, and desktop.

## Architecture

**CRITICAL: Complete UI Separation - Zero mixing of legacy and modern code**

Dual-app structure: `AppRouter` (index.js) switches between `LegacyApp.js` and `modern/App.tsx` based on Redux `uiMode`.

- **Legacy**: `/src/containers/LegacyApp.js`, `/src/components/` (JavaScript)
- **Modern**: `/src/containers/modern/App.tsx`, `/src/components/modern/` (TypeScript + MUI v7)
- **Shared**: Redux state, GraphQL client, map components (with `uiMode` prop), utilities

### Shared Containers Pattern

Some containers are shared by both apps but **MUST conditionally render** based on `uiMode`:

**StopPlace.tsx** - Shared container that renders:
- `uiMode === 'modern'` → `EditParentStopPlace` (modern) for parent stops
- `uiMode === 'legacy'` → `EditParentGeneral` (legacy) for parent stops
- Regular stops currently only have legacy `EditStopGeneral` (modern version not yet created)

**Violation Example:**
```typescript
// ❌ WRONG - Always renders modern component
<EditParentStopPlace />

// ✅ CORRECT - Conditionally renders based on uiMode
{uiMode === "modern" ? (
  <EditParentStopPlace />
) : (
  <EditParentGeneral disabled={disabled} />
)}
```

**Rule:** Any container or component used by both apps MUST check `uiMode` to render the appropriate version.

### Search Flow (Modern UI)

Direct navigation from search to edit page without intermediate panels:

1. **Search execution** (`useSearchBox.tsx`): User types → debounced search (500ms) → results displayed
2. **Selection** (`handleNewRequest`): Click result → set `loadingSelection=true` → fetch full stop place data
3. **Map marker**: Set marker on map with coordinates → map animates to location (0.25s)
4. **Navigation**: Navigate to edit route → URL changes → `StopPlace.tsx` detects new ID
5. **Data loading**: `getStopPlaceWithAll()` fetches complete stop place data
6. **Loading coverage**: LoadingDialog shows throughout entire flow (from click to data loaded)
7. **Clean transition**: Edit boxes hidden during loading to prevent showing stale data

**Key files**:
- `src/components/modern/MainPage/hooks/useSearchBox.tsx` - Search logic and navigation
- `src/containers/StopPlace.tsx` - Shared container with `uiMode` checks for loading states
- `src/components/modern/Shared/LoadingDialog.tsx` - Centered loading dialog with animation

## Standards

- **Responsive-first**: All modern components must work on mobile, tablet, desktop using `useMediaQuery` and MUI breakpoints
- TypeScript with proper types, custom hooks for logic
- MUI v7 APIs: `slotProps.htmlInput` not `inputProps`, `slotProps.input` not `InputProps`
- Barrel exports via `index.ts`, theme colors via `sx` prop

## Structure

Modern UI: `/src/components/modern/` with Header, MainPage, GroupOfStopPlaces, Dialogs, Shared. Each feature has `types.ts`, components/, hooks/.

## Theme System

JSON config → MUI Theme via module augmentation (`theme-config.d.ts`). Custom properties: `theme.assets.logo`, `theme.environment.{env}`. Config loaded from `bootstrap.json` `themeConfigs` array. First = default, auto-hides switcher if <2 themes.

## Patterns

**Dialogs**: CloseIcon top-right, buttons inline in DialogContent (no DialogActions)
**Drawers**: Persistent (desktop) / temporary (mobile), FloatingActionButton for collapse
**GroupOfStopPlaces**: X = close, chevron = collapse (horizontal on desktop, vertical on mobile)
**Loading States**: Use LoadingDialog (modern UI) for data fetching, shows ModalityLoadingAnimation with optional message

## Component Refactoring Best Practices

**When to Refactor**: Components over ~300 lines, multiple responsibilities, difficult to test, or hard to understand.

### The Refactoring Pattern

Follow this consistent pattern for splitting large components into maintainable pieces:

**1. Directory Structure**
```
ComponentName/
├── hooks/
│   └── useComponentName.ts      # Business logic and state
├── components/
│   ├── SubComponent1.tsx        # Focused UI components
│   ├── SubComponent2.tsx
│   └── index.ts                 # Barrel exports
└── types.ts (optional)          # Shared types
```

**2. Extract Business Logic into Hooks**
- Move all state management (`useState`, `useEffect`) into custom hook
- Extract event handlers and business logic
- Use `useCallback` for handlers to prevent unnecessary re-renders
- Use `useMemo` for expensive computations or data transformations
- Return clean interface for component consumption

**Hook Pattern Example:**
```typescript
export const useComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState);

  const handleAction = useCallback(() => {
    // Business logic here
  }, [dependencies]);

  return {
    state,
    handleAction,
    // Other handlers and computed values
  };
};
```

**3. Split UI into Focused Components**
- Each component should have **single responsibility**
- Break down by UI section or logical grouping
- Keep components small (~50-150 lines)
- Pass only needed props (avoid prop drilling)
- Add JSDoc comments explaining purpose

**Component Pattern Example:**
```typescript
interface SubComponentProps {
  data: DataType;
  onAction: () => void;
}

/**
 * Brief description of what this component does
 */
export const SubComponent: React.FC<SubComponentProps> = ({
  data,
  onAction,
}) => {
  // Render focused UI section
};
```

**4. Create Orchestrator Component**
- Main component becomes clean orchestrator
- Uses hook for business logic
- Composes sub-components
- Handles conditional rendering
- Delegates responsibilities to focused components

**Orchestrator Pattern Example:**
```typescript
export const MainComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const {
    state,
    handleAction,
  } = useMainComponent({ prop1, prop2 });

  return (
    <>
      <SubComponent1 data={state.data1} onAction={handleAction} />
      <SubComponent2 data={state.data2} />
    </>
  );
};
```

**5. Use Barrel Exports**
```typescript
// components/index.ts
export { SubComponent1 } from "./SubComponent1";
export { SubComponent2 } from "./SubComponent2";
```

### Refactoring Examples

**Completed Refactorings:**
1. **EditGroupOfStopPlaces** (410 → 183 lines, 56% reduction)
   - Pattern: MinimizedBar, DrawerContent, Dialogs separation
   - Location: `src/components/modern/MainPage/components/EditGroupOfStopPlaces/`

2. **FavoriteStopPlaces** (318 → 62 lines, 81% reduction)
   - Pattern: Hook + EmptyState + List + ListItem
   - Location: `src/components/modern/MainPage/components/FavoriteStopPlaces/`

3. **TagsDialog** (323 → 106 lines, 67% reduction)
   - Pattern: Hook + List + AddForm + Item
   - Location: `src/components/modern/Dialogs/TagsDialog/`

4. **TerminateStopPlaceDialog** (374 → 184 lines, 51% reduction)
   - Pattern: Hook + Info + Warning + DateTime + Options
   - Location: `src/components/modern/Dialogs/TerminateStopPlaceDialog/`

5. **NavigationMenu** (311 → 81 lines, 74% reduction)
   - Pattern: Hook + Mobile + Desktop + ItemRenderer
   - Location: `src/components/modern/Header/components/NavigationMenu/`

### Naming Conventions

- **Hooks**: `useComponentName` (e.g., `useTagsDialog`, `useNavigationMenu`)
- **Components**: `PascalCase` descriptive names (e.g., `DateTimeSelection`, `UsageWarning`)
- **Files**: Match component/hook names exactly
- **Directories**: Match main component name

### Benefits

- **Maintainability**: Small, focused files easy to understand
- **Testability**: Isolated logic and UI can be tested independently
- **Reusability**: Focused components can be reused elsewhere
- **Readability**: Clear separation of concerns
- **Type Safety**: Explicit prop interfaces prevent errors

## Recent Work

- Dual-app architecture (LegacyApp.js / modern/App.tsx)
- Modern GroupOfStopPlaces with drawer (responsive, collapsible)
- Theme system refactor (module augmentation, bootstrap.json config)
- UX improvements (X=close, chevron=collapse, FAB on desktop, minimized bar on mobile)
- Direct search-to-edit flow (modern UI): search → LoadingDialog → navigate to edit page
  - LoadingDialog with ModalityLoadingAnimation (white background, shows stop place name)
  - Fast map transitions (0.25s animation)
  - Seamless loading coverage (no gaps, edit boxes hidden during load)
  - Prevents map jumping during navigation

### Group of Stop Places Improvements

**Enhanced InfoDialog** - Comprehensive metadata display:
- Name field with optional display
- ID with integrated `CopyIdButton` for easy clipboard copy
- Lat/long coordinates with 6-decimal precision formatting
- Created/Modified/Version metadata
- Monospace font for technical data (ID, coordinates)
- Files: `InfoDialog.tsx`, `EditGroupOfStopPlaces.tsx`, `types.ts`, `MinimizedBar.tsx`

**Fixed Navigation Issues** - Consistent data fetching across all entry points:
- **Problem**: Navigating from one group to another via search/favorites did nothing; no loading animation
- **Root cause**: Container only fetched on mount, not on route changes; search skipped data fetch for groups
- **Solution**:
  - `GroupOfStopPlaces.tsx`: Added `useParams`, refetch on `groupId` change, wrapped handlers in `useCallback`
  - `useSearchBox.tsx`: Fetch group data via `getGroupOfStopPlacesById` before navigation
  - `FavoriteStopPlaces.tsx`: Added same fetch-before-navigate pattern as search
  - All paths now show LoadingDialog during data fetch

**Data Fetching Pattern** - Applied consistently across search, favorites, and route changes:
1. Set loading state with entity name
2. Fetch entity data (`getGroupOfStopPlacesById` for groups, `getStopPlaceById` for stops)
3. Update map markers (for stop places)
4. Navigate to edit page
5. Clear loading state in `.finally()`
6. Show LoadingDialog throughout process

**Result**: Reliable navigation with proper loading UX across all paths (search autocomplete, favorites panel, direct URL changes)

## Guidelines

**CRITICAL: Never mix legacy and modern**
- ❌ Import modern into legacy, add `uiMode` checks in legacy
- ✅ Create TypeScript copies in `/src/components/modern/`, keep legacy untouched

**New components**: TypeScript in `/src/components/modern/`, MUI v7, barrel exports, custom hooks, **responsive on all screen sizes**
**New routes**: Add to `modern/App.tsx` (not `LegacyApp.js`)

**Translations (MANDATORY)**:
- MUST add translations to ALL 5 language files: `/src/static/lang/{en,nb,sv,fi,fr}.json`
- NEVER use hardcoded text in UI components
- Check for existing similar translations to maintain consistency
- Test in all languages before committing

**Testing**: `npm run build`, test both UIs, **verify on mobile/tablet/desktop breakpoints**
