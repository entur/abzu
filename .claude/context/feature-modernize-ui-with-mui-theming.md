# Abzu UI Modernization

Stop Place Registry app modernizing its UI with a dual-app architecture. **Core goal: a fully responsive, modern MUI v7 experience** across mobile, tablet, and desktop, built without touching the legacy app.

> **Current phase: user-feedback hardening.** The modern UI is feature-complete enough to be used. We are now iterating on real feedback in three sequential passes — see [Current Phase](#current-phase-user-feedback-hardening) below.

## Current Phase: User-Feedback Hardening

We are no longer building net-new features. We are polishing what exists based on user feedback, in **three ordered passes**. Finish a pass before moving to the next.

### Pass 1 — Layout & Styling (active)
Pure visual/structural correctness. No behavior changes.
- Spacing, alignment, density, overflow, truncation, responsive breakpoints
- Theme-token correctness (no hardcoded colours), contrast, dark/light parity
- Drawer/panel/dialog sizing on mobile/tablet/desktop
- Marker, popup, and map-control visual polish
- **Rule:** if a change alters what a control *does* (not just how it looks), it belongs in Pass 2.

### Pass 2 — Usability
Interaction and flow improvements.
- Navigation flows, focus management, keyboard access, loading/empty/error states
- Affordance clarity (what's clickable, what state am I in), confirmations, undo
- Reducing clicks/friction in common tasks (search → edit, quay/parking editing)

### Pass 3 — Verification
Confirm everything works as intended.
- `npx tsc --noEmit` clean, `npm run build` passes
- Manual test of both UIs, all breakpoints, all 5 languages
- Regression check against legacy behavior where parity is expected

When working an item, state which pass it belongs to. Defer cross-pass scope creep with a note rather than mixing concerns.

## Architecture

**CRITICAL: Complete UI separation — zero mixing of legacy and modern code.**

The app forks at the **root**, in `src/index.js`, based on `config.uiMode`:

```js
// src/index.js
const configUiMode = config.uiMode ?? "legacy";
if (configUiMode === "legacy") return <LegacyApp />;          // locked to legacy
return reduxUiMode === "modern" ? <ModernApp /> : <LegacyApp />; // "dual": user toggles
```

- `uiMode: "legacy"` (default) — always `LegacyApp`. Modern code never mounts.
- `uiMode: "dual"` — user can switch; their choice persists in Redux `state.user.uiMode`.

Because the fork is at the top, **modern containers never render inside the legacy tree** (and vice-versa). There is no per-container `uiMode` branching anymore — that older pattern is gone.

- **Legacy app**: `src/containers/LegacyApp.js`, `src/components/` (JavaScript, class components). **Untouched.**
- **Modern app**: `src/containers/modern/App.tsx`, `src/containers/modern/*`, `src/components/modern/` (TypeScript + MUI v7).
- **Shared**: Redux store/actions, GraphQL client, models, utilities. These are the only legitimate integration points.

### Modern App Shell & Routing

`src/containers/modern/App.tsx` owns the modern shell:
- `<ModernHeader>`, global/local loading indicators, `<SnackbarWrapper>`
- A single `<PersistentMap>` mounted **inside the Router but outside `<Routes>`** — it survives route changes without remounting.
- Theme provided via `AbzuThemeProvider` (overridable by a `CustomThemeProvider` feature toggle).

Modern routes (own `<Routes>`, separate from legacy):

| Route | Container (`src/containers/modern/`) |
|---|---|
| `/` | `StopPlaces.tsx` (search/main page) |
| `/stop_place/:stopId` | `StopPlace.tsx` → `EditStopPage` / `EditParentStopPlace` |
| `/group_of_stop_place/:groupId` | `GroupOfStopPlaces.tsx` |
| `/reports` | `ReportPage.tsx` |

`src/containers/modern/StopPlace.tsx` selects the editor by entity kind: parent stop → `EditParentStopPlace`, regular stop → `EditStopPage`. (Both modern; the legacy `EditStopGeneral`/`EditParentGeneral` live only in the legacy `src/containers/StopPlace.tsx`.)

### Search-to-Edit Flow (Modern)

Direct navigation from search to edit, no intermediate panels:
1. Debounced search (500ms) in `MainPage/hooks/` → results.
2. Select result → set loading state with entity name → fetch full entity (`getStopPlaceWithAll` / `getGroupOfStopPlacesById`).
3. Place/animate map marker (fast ~0.25s transition).
4. Navigate to edit route; container detects the new `:id` param and (re)fetches on change.
5. `LoadingDialog` covers the whole flow; edit panels stay hidden until data is ready (no stale flash).

This fetch-before-navigate pattern is applied consistently across search, favorites, and direct URL/route changes.

## Standards

- **Responsive-first**: every modern component works on mobile/tablet/desktop via `useMediaQuery` + MUI breakpoints.
- **TypeScript only** in modern code; explicit prop interfaces; explicit hook return types; no `any` except at the Redux/legacy-JS boundary (`state.x as any`).
- **No classes** — functional components + custom hooks only.
- **MUI v7 APIs**: `slotProps.htmlInput` (not `inputProps`), `slotProps.input` (not `InputProps`), `<Grid size={…}>` (not `item xs`).
- **Theme tokens only** — no hardcoded hex in `sx`/inline styles (RGBA black shadows excepted). Use `*.contrastText`, `borderColor: "background.paper"`, and the `sx` theme-callback form for `alpha()`.
- **Named exports**, barrel `index.ts` per feature.
- **No `console.log`, no commented-out code** in committed work.

## Structure

`src/components/modern/` — one folder per feature, each typically with `components/`, `hooks/`, and `types.ts`:

- **Header/** — `ModernHeader`, `NavigationMenu`, UI customization (theme/uiMode toggles)
- **MainPage/** — search box, filters, results, `FavoriteStopPlaces`
- **EditStopPage/** — regular stop editor: tabbed view (info / accessibility / facilities / assistance), `QuaysSection`/`QuayItem`/`QuayPanel`, `ParkingSection`/`ParkingItem`/`ParkingPanel`/`ParkAndRideFields`, `BoardingPositionsTab`, `NewStopWizard`, `TimetableDialog`, 8 dialogs, ~10 hooks
- **EditParentStopPlace/** — parent stop editor
- **GroupOfStopPlaces/** — group editor with collapsible drawer + `InfoDialog`
- **ReportPage/** — filters, column toggles, pagination, CSV export, URL-synced state
- **Dialogs/** — `TagsDialog`, `AltNamesDialog`, `TerminateStopPlaceDialog`
- **Map/** — `ModernEditStopMap`, `FareZonesPanel`, `controls/`, `crosshair/`, `layers/`, `tile-sources/`, and `markers/` (StopPlace, Quay, Parking, BoardingPosition, Neighbour markers + popups + `QuayBearingIndicator`)
- **Shared/** — `LoadingDialog`, `ModalityLoadingAnimation`, `MinimizedBar`, `CenterMapButton`, `CopyIdButton`, `FavoriteButton`, `GroupMembership`, `ParentMembership`, `drawerPreference`, `useNavigateToStopPlace`, etc.

## Theme System

JSON config → MUI theme via module augmentation (`theme-config.d.ts`). Custom tokens: `theme.assets.logo`, `theme.environment.{env}`, augmented `tertiary` palette.

- Runtime theme JSONs live in `public/theme/` (fetched at runtime): `default-theme.json`, `entur-theme.json`, `fintraffic-theme.json`.
- `src/theme/config/default-theme.json` is the bundled fallback (statically imported by `loader.ts` when fetch fails).
- Configured via `themeConfigs: string[]` in bootstrap/environment JSON. **First entry = default**; switcher auto-hides if < 2 themes.

**Semantic marker colours**: stop place → `primary.main`, quay → `success.main`, bike parking → `info.main`, P&R → `tertiary.main`, boarding position → `secondary.main`, focused → `warning.main`, neighbour → `alpha(primary.main, 0.6)`.

## Map (MapLibre) Notes

- Single persistent map; never torn down between routes.
- **Coord order:** Redux stores `[lat, lng]`; MapLibre `flyTo`/`center`/`Marker` take `[lng, lat]` — always swap explicitly.
- Neighbour stops load at `zoom > 14`, cleared at `zoom ≤ 14`.
- Stable debounce: keep debounced callbacks in `useMemo([dispatch])`, pass fresh state via `useRef` — never put volatile state in the debounce dep array.

## Patterns

- **Dialogs**: CloseIcon top-right; action buttons inline in `DialogContent` (no `DialogActions`).
- **Drawers**: persistent on desktop / temporary on mobile; collapse via FAB (desktop) or minimized bar (mobile). Open/closed state is sticky via `Shared/drawerPreference.ts` (localStorage), shared by all panel types.
- **GroupOfStopPlaces**: X = close, chevron = collapse (horizontal desktop / vertical mobile).
- **Loading states**: `LoadingDialog` with `ModalityLoadingAnimation` (white bg, shows entity name) throughout data fetches.
- **flushSync before async navigation**: `flushSync(() => setLoading(true))` before dispatching an async fetch so the loading UI actually renders (React 18 batching would otherwise swallow it). Clear in `.finally()`.

## Component Refactoring Pattern

Refactor components over ~150 lines or with multiple responsibilities:

```
ComponentName/
├── hooks/useComponentName.ts   # state + handlers (useCallback) + derived data (useMemo)
├── components/                 # focused 50–150 line sub-components, single responsibility
│   └── index.ts                # barrel exports
└── types.ts                    # shared prop/data types
```

The main component becomes a thin orchestrator: call the hook, compose sub-components, handle conditional rendering. Hooks declare explicit return types. Naming: hooks `useX`, components `PascalCase`, files match names exactly.

**Reference refactorings** (pattern + location):
- `EditGroupOfStopPlaces` — MinimizedBar / DrawerContent / Dialogs — `MainPage/components/EditGroupOfStopPlaces/`
- `FavoriteStopPlaces` — Hook + EmptyState + List + ListItem — `MainPage/components/FavoriteStopPlaces/`
- `TagsDialog` — Hook + List + AddForm + Item — `Dialogs/TagsDialog/`
- `TerminateStopPlaceDialog` — Hook + Info + Warning + DateTime + Options — `Dialogs/TerminateStopPlaceDialog/`
- `NavigationMenu` — Hook + Mobile + Desktop + ItemRenderer — `Header/components/NavigationMenu/`

## Guidelines

**Never mix legacy and modern.**
- ❌ Import modern into legacy, or add `uiMode` checks inside legacy components.
- ✅ Build/extend TypeScript components in `src/components/modern/`; keep legacy untouched.

**New routes**: add to `src/containers/modern/App.tsx` (never `LegacyApp.js`).

**Translations (mandatory)**: add every new key to **all 5** files `src/static/lang/{en,nb,sv,fi,fr}.json`. No hardcoded UI text. Reuse existing keys for consistency. Keys are alphabetically ordered.

## Checks Before Finishing

1. `npx tsc --noEmit` — zero errors.
2. No hardcoded hex in `sx`/inline styles (RGBA black shadows excepted).
3. All 5 language files updated for any new key.
4. Verified on mobile / tablet / desktop breakpoints, both UIs where parity applies.
