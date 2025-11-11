# Purpose of Grouping - Adding New Translations

This guide explains how to add translations for new "Purpose of Grouping" types in GroupOfStopPlaces.

## Quick Reference

When a new purpose type is added to the backend (e.g., `regionalHub`), add translations to all 5 language files.

### Translation Key Pattern

```
purpose_of_grouping_type_<purposeTypeName>
```

Where `<purposeTypeName>` matches the `name.value` from the GraphQL API response.

## Step-by-Step

### 1. Identify the Purpose Type Name

Check what the GraphQL API returns in the `name.value` field. For example:
```json
{
  "id": "...",
  "name": {
    "value": "placeCentroid"  // ← This is what you need
  }
}
```

### 2. Add Translation Keys

Add the translation key to **all 5 language files** in `/src/static/lang/`:

| File | Language |
|------|----------|
| `en.json` | English |
| `nb.json` | Norwegian Bokmål |
| `fi.json` | Finnish |
| `fr.json` | French |
| `sv.json` | Swedish |

### 3. Format

Add the key after the existing `purpose_of_grouping_is_required` line:

```json
{
  "purpose_of_grouping": "Purpose of grouping",
  "purpose_of_grouping_is_required": "Purpose of grouping is required",
  "purpose_of_grouping_type_placeCentroid": "City/town main stops group",
  "purpose_of_grouping_type_regionalHub": "Regional hub",  // ← New type
  ...
}
```

## Example: Adding "regionalHub"

**en.json:**
```json
"purpose_of_grouping_type_regionalHub": "Regional hub"
```

**nb.json:**
```json
"purpose_of_grouping_type_regionalHub": "Regionalt knutepunkt"
```

**fi.json:**
```json
"purpose_of_grouping_type_regionalHub": "Alueellinen solmukohta"
```

**fr.json:**
```json
"purpose_of_grouping_type_regionalHub": "Hub régional"
```

**sv.json:**
```json
"purpose_of_grouping_type_regionalHub": "Regional knutpunkt"
```

## Automatic Fallback

If a translation is missing, the system automatically falls back to the API value (`name.value`) or ID. However, it's best practice to add all translations to provide a good user experience.