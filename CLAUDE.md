# Abzu — Claude Code Instructions

## Language & Style

- **TypeScript only** for all new files. No `.js` new files in `src/components/modern/` or `src/containers/modern/`.
- **No classes.** Use functional components and custom hooks exclusively. Never write `class Foo extends React.Component`.
- **Small files.** Each file should do one thing. If a component needs a hook, extract it to `hooks/use<Name>.ts` in the same folder. If a file grows past ~150 lines, split it.
- **Named exports only.** No default exports in modern code (exception: route-level containers if the router requires it).

## Clean Code

- **Single responsibility.** Every function, hook, and component does one thing. If you need "and" to describe it, split it.
- **Guard clauses over nesting.** Use early returns at the top of functions/components instead of deeply nested `if/else` blocks.
- **No magic values.** Extract all numbers and strings that carry meaning as named `const` at the top of the file (e.g. `const MARKER_SIZE = 28` not an inline `28`).
- **No `any` in component props or local types.** Define explicit interfaces for all props. `as any` is only acceptable at Redux/legacy-JS boundaries (e.g. `state.user as any`) — never in local logic or component props.
- **Self-documenting names.** Variables, functions, and components should read like sentences. No abbreviations (except well-known ones like `id`, `url`, `lat`, `lng`). No single-letter identifiers outside loop counters.
- **`const` by default.** Use `let` only when reassignment is genuinely required; never `var`.
- **Destructure at the top.** Destructure props and selector results at the top of the component/hook, not inline in JSX.
- **No commented-out code.** Delete dead code; version control preserves history.
- **No console.log in committed code.**
- **Explicit return types on hooks.** Custom hooks (`use*.ts`) should declare their return type explicitly so callers know the contract without reading the implementation.

## Architecture

- **Modern UI root**: `src/containers/modern/App.tsx`. All modern routes live here.
- **Pattern**: thin container in `src/containers/modern/` → component in `src/components/modern/` → hooks in `hooks/` subfolder.
- **Hard rule**: never import modern components into legacy code or vice versa. Legacy (`src/components/Map/`, `src/containers/StopPlaces.js`, etc.) is untouched.
- **Redux as integration boundary**: modern components read Redux state via `useAppSelector`, dispatch via `useAppDispatch`. No prop-drilling of Redux state.
- **All modern components are TypeScript** — cast legacy Redux slices with `as any` where the reducer is still JS (e.g. `state.user as any`).

## MUI Theming

- **No hardcoded colours.** Use MUI theme tokens exclusively: `primary.main`, `success.main`, `info.main`, `tertiary.main`, `secondary.main`, `warning.main`, `background.paper`, `text.secondary`, etc.
- **`tertiary` is type-augmented** — safe to use in `sx` and theme callbacks.
- For opacity-modified theme colours (e.g. focus rings), use the `sx` callback form: `sx={(theme) => ({ boxShadow: \`0 0 0 2px \${alpha(theme.palette.warning.main, 0.5)}\` })}`.
- Use `borderColor: "background.paper"` instead of `border: "2px solid #fff"`.
- Use `color: "*.contrastText"` on text inside coloured boxes instead of `color: "#fff"`.
- **MUI version: v7.3.7**. Use `<Grid size={…}>` (not `item xs={…}`).

## Map (MapLibre)

- **Single persistent map**: `<PersistentMap>` in `App.tsx`, mounted once, never torn down between routes.
- All map markers live in `src/components/modern/Map/markers/`. One file per element type.
- Marker colours follow semantic roles: stop place → `primary.main`, quay → `success.main`, bike parking → `info.main`, P&R parking → `tertiary.main`, boarding position → `secondary.main`, focused state → `warning.main`, neighbour stops → `alpha(primary.main, 0.6)`.
- **Coord order**: Redux stores `[lat, lng]`. MapLibre `flyTo`/`center`/`Marker` takes `[lng, lat]`. Always swap explicitly.
- Neighbour stops load at `zoom > 14`; cleared at `zoom ≤ 14` via `removeStopsNearbyForOverview`.
- Stable debounce pattern: keep debounced callbacks in `useMemo([dispatch])` and use a `useRef` to pass fresh state into them — never add volatile state to the debounce dependency array.

## i18n

- All user-facing strings use `formatMessage({ id: "key" })` from `useIntl()`.
- Add new keys to both `src/static/lang/en.json` and `src/static/lang/nb.json` in the same edit.
- Keys are alphabetically ordered — insert at the correct position.

## Checks Before Finishing

1. `npx tsc --noEmit` — must pass with zero errors before considering any task done.
2. No hardcoded hex colours in `sx` props or inline styles (exception: RGBA black shadows `rgba(0,0,0,…)` are acceptable).
3. Both `en.json` and `nb.json` updated for any new i18n key.
