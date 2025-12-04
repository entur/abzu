# Branch: modes-and-submodes-changes

## Purpose
Updates to stop place modalities and submodes, including adding funicular mode, removing specific submodes from certain stop types, and making hidden stop types configurable.

## Key Changes

### 1. Removed Submode from harbourPort
- **Removed**: `highSpeedPassengerService` from `harbourPort` stop type
- **Still available**: `highSpeedPassengerService` remains on `ferryStop`
- **Files modified**: `src/models/stopTypes.js`

### 2. Added Funicular Mode
- **New stop type**: `funicular` with `funicular` submode
- **Transport mode**: `funicular`
- **Translations**: Added to all 5 language files (en, nb, fi, fr, sv)
  - English: "Funicular"
  - Norwegian: "Kabelbane"
  - Finnish: "Funikulaari"
  - French: "Funiculaire"
  - Swedish: "Bergbana"
- **Icons**:
  - SVG sprite icon added to `src/static/icons/svg-sprite.svg`
  - Map icons (PNG and SVG) added to `src/utils/iconUtils.ts`
  - Standard size: 100x100 pixels

### 3. Bidirectional Mapping: Funicular ↔ liftStation
**Problem**: Funicular appears as separate option in UI but backend stores it as `liftStation`

**Solution**: Two-way mapping system
- **UI → Backend** (`src/modelUtils/mapToQueryVariables.js`):
  - Added `mapStopPlaceTypeForBackend()` function
  - Converts `funicular` to `liftStation` in mutations

- **Backend → UI** (`src/models/StopPlace.js`, `src/modelUtils/mapToClient.js`):
  - Added `mapStopPlaceTypeForUI()` function
  - Converts `liftStation` with `funicular` submode back to `funicular` for display

**Result**: Users see "Funicular" in UI, backend stores as `stopPlaceType: liftStation, transportMode: funicular, submode: funicular`

### 4. Added cityTram Submode
- **Added to**: `onstreetTram` stop type
- **Submodes**: Now includes both `localTram` and `cityTram`
- **Translation change**: English stop type name changed from "City tram" to "Tram stop"
- **Translations for cityTram**: Added to all 5 language files

### 5. Hidden Stop Types (Configurable)
- **Requirement**: Hide "other" stop type from modality menu while maintaining backwards compatibility
- **Implementation**: Moved from hardcoded to configuration-based
  - Added `ModalityConfig` interface to `src/config/ConfigContext.ts`
  - Added `modalityConfig.hiddenStopTypes` array to `public/bootstrap.json`
  - Updated `ModalitiesMenuItems.js` to read from config using `ConfigContext.Consumer`
- **Current config**: `"hiddenStopTypes": ["other"]`

### 6. Test Fixes
- **Fixed**: `src/modelUtils/modeUtils.test.js`
- **Issue**: Test expected `harbourPort` to support `highSpeedPassengerService`
- **Fix**: Updated test to expect `harbourPort` NOT to contain that submode

## Files Modified
1. `src/models/stopTypes.js` - Added funicular, removed highSpeedPassengerService from harbourPort, added cityTram
2. `src/components/EditStopPage/ModalitiesMenuItems.js` - Read hiddenStopTypes from config
3. `src/static/lang/en.json`, `nb.json`, `fi.json`, `fr.json`, `sv.json` - Added translations
4. `src/static/icons/svg-sprite.svg` - Added funicular SVG
5. `src/components/MainPage/ModalityIconSvg.js` - Added funicular icon mapping
6. `src/utils/iconUtils.ts` - Added funicular PNG and SVG imports
7. `src/config/ConfigContext.ts` - Added ModalityConfig interface
8. `public/bootstrap.json` - Added modalityConfig section
9. `src/modelUtils/mapToQueryVariables.js` - Added funicular→liftStation mapping for mutations
10. `src/models/StopPlace.js` - Added liftStation→funicular reverse mapping
11. `src/modelUtils/mapToClient.js` - Added reverse mapping for search results
12. `src/modelUtils/modeUtils.test.js` - Fixed test expectations

## Technical Patterns Used
- **Configuration-driven UI**: Using bootstrap.json and ConfigContext for runtime configuration
- **Bidirectional mapping**: UI types ↔ Backend types for data consistency
- **Model classes**: StopPlace, ParentStopPlace, ChildOfParentStopPlace for data transformation
- **Translation system**: formatMessage with translation keys like `stopTypes_{type}_name`

## Build Status
✅ All tests passing
✅ Build successful
