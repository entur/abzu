# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Abzu** is a stop place register frontend for managing public transport stop places in Norway. It communicates with the Tiamat GraphQL API backend for all stop place data operations. The application manages stop places, quays, accessibility information, parking, equipment, and groupings of stop places.

## Build Commands

```bash
# Install dependencies
npm install

# Development server (port 9000 by default)
npm start

# Development with local Tiamat backend
npm run dev-local

# Build for production
npm run build

# Preview production build
npm serve

# Run tests (watch mode)
npm test

# Run tests with coverage report
npm test:coverage

# Format code with Prettier
npm run format

# Check code formatting
npm run check

# Analyze bundle size
npm run analyze

# Fetch GraphQL schema from Tiamat backend
npm run fetch-schema
```

### Environment Variables

- `PORT` - Override development port (default: 9000)
- `VITE_REACT_APP_TIAMAT_BASE_URL` - Override GraphQL endpoint URL for development

## Architecture

### Tech Stack

- **Build System**: Vite with TypeScript and React
- **UI Framework**: React 19 with Material-UI (MUI) v7
- **State Management**: Redux Toolkit with redux-first-history for routing integration
- **GraphQL**: Apollo Client connecting to Tiamat backend
- **Maps**: Leaflet and react-leaflet
- **Authentication**: OIDC (oidc-client-ts) - provider agnostic
- **Error Tracking**: Sentry
- **Internationalization**: react-intl with 5 languages (en, nb, fi, fr, sv)
- **Testing**: Vitest with Testing Library

### Configuration System

Application configuration is loaded from `/bootstrap.json` at runtime. For local development, place this file in `public/bootstrap.json`. See `src/config/ConfigContext.ts` for the full configuration schema.

Key configuration includes:
- `tiamatBaseUrl` - GraphQL endpoint
- `oidcConfig` - OIDC authentication settings
- `featureFlags` - Feature toggles
- `mapConfig` - Map tiles and default view
- `localeConfig` - Language settings
- `extPath` - Path to company-specific extensions under `/src/ext`

### State Management Pattern

Uses Redux Toolkit with traditional actions/reducers pattern (not fully migrated to RTK slices):

- **Store**: `src/store/store.ts` - Configures store with redux-first-history and Sentry integration
- **Reducers**: `src/reducers/` - Domain-specific reducers (stopPlace, user, map, zones, etc.)
- **Actions**: `src/actions/` - Action creators organized by domain (StopPlaceActions, TiamatActions, UserActions)
- **Router Integration**: Uses redux-first-history to sync routing with Redux state

### GraphQL Client Structure

Two Apollo clients managed in `src/graphql/clients.js`:

- **Tiamat Client** - Main backend for stop place data (queries/mutations in `src/graphql/Tiamat/`)
- **OTP Client** - Optional client for journey planning data

GraphQL operations are organized in:
- `fragments.js` - Reusable GraphQL fragments
- `queries.js` - Query operations
- `mutations.js` - Mutation operations

The schema introspection is stored in `schema.json` and can be refreshed via `npm run fetch-schema`.

### Data Models

Domain models in `src/models/` define the shape of entities and provide utility functions:

- `StopPlace.js` - Main stop place entity
- `Quay.js` - Platform/boarding area within a stop place
- `ParentStopPlace.js` - Grouping of related stop places
- `GroupOfStopPlaces.js` - Purpose-based groupings
- `AccessibilityLimitation.ts`, `Equipments.ts` - Equipment and accessibility data
- `Parking.js`, `PathLink.js` - Associated infrastructure
- Various enum models for types and categories

### Component Organization

- **Pages**: `src/containers/` - Route-level container components (App, StopPlaces, StopPlace, GroupOfStopPlaces, ReportPage)
- **UI Components**: `src/components/` organized by feature area:
  - `EditStopPage/` - Stop place editing interface
  - `EditParentStopPage/` - Parent stop place editing
  - `GroupOfStopPlaces/` - Group management
  - `Map/` - Leaflet-based map components
  - `MainPage/` - Search and listing
  - `Dialogs/` - Modal dialogs
  - `Zones/` - Fare and tariff zone management
- **Extensions**: `src/ext/` - Company-specific toggleable components loaded based on `extPath` config

### Routing

Uses react-router-dom v7 with redux-first-history integration. Routes defined in `src/routes/` and instantiated in `src/index.js`:

- `/` - Main stop places listing
- `/stop-place/:stopId` - Individual stop place editor
- `/group-of-stop-places/:groupId` - Group editor
- `/report` - Reporting interface

### Internationalization

Translations in `src/static/lang/` with 5 language files: `en.json`, `nb.json`, `fi.json`, `fr.json`, `sv.json`.

When adding translations for new backend enum types (e.g., purpose of grouping types), follow the pattern documented in `docs/PURPOSE_OF_GROUPING_TRANSLATIONS.md`:

1. Add key with format `{category}_type_{value}` to all 5 language files
2. The `value` must match the GraphQL API `name.value` field
3. System automatically falls back to API value if translation missing

### Feature Toggle System

Uses `@entur/react-component-toggle` to enable/disable components based on configuration. Company-specific features are placed in `src/ext/{companyName}/` and loaded via `extPath` configuration. See `src/ext/README.md` for documentation.

### Testing

Tests use Vitest with jsdom environment. Test files located in `src/test/` with `.spec.js` extension. Configuration in `vite.config.mts` under the `test` key.

Run single test file:
```bash
npx vitest run src/test/mapUtils.spec.js
```

### Code Quality

- **Formatting**: Prettier with `prettier-plugin-organize-imports` (auto-organizes imports)
- **Pre-commit**: Husky runs `lint-staged` to format staged files before commit
- **TypeScript**: Gradual migration - both `.js` and `.ts` files present (strict mode enabled)

### Legacy Patterns

Note these patterns when working with the codebase:

- Mix of `.js` and `.ts` files - TypeScript migration in progress
- Traditional Redux pattern with action creators (not fully migrated to RTK slices)
- Some class components may still exist alongside functional components
- Material-UI usage mixes older patterns with newer MUI v7 patterns

## Common Workflows

### Adding a New Stop Place Field

1. Add GraphQL fragment to `src/graphql/Tiamat/fragments.js`
2. Update queries/mutations in `src/graphql/Tiamat/queries.js` or `mutations.js`
3. Add field to model in `src/models/StopPlace.js`
4. Update reducer logic in `src/reducers/stopPlaceReducer.js`
5. Add UI components in `src/components/EditStopPage/`
6. Add translations to all language files
7. Add tests in `src/test/`

### Working with GraphQL Schema Changes

When the Tiamat backend schema changes:

1. Ensure `public/bootstrap.json` points to correct backend
2. Run `npm run fetch-schema` to update `src/graphql/Tiamat/schema.json`
3. Update fragments, queries, or mutations as needed
4. TypeScript types may need manual updates

### Adding New Translations

Always add new translation keys to all 5 language files in `src/static/lang/`:
- `en.json`
- `nb.json`
- `fi.json`
- `fr.json`
- `sv.json`

For enum-type translations from backend, follow the pattern in `docs/PURPOSE_OF_GROUPING_TRANSLATIONS.md`.
