# Abzu Theme Configuration Guide

Theme files are JSON documents placed in `public/theme/`. The bundled fallback lives at
`src/theme/config/default-theme.json` (statically imported; used before the runtime fetch
completes). All files are loaded by `src/theme/config/loader.ts` and turned into a MUI
`Theme` object via `src/theme/config/createThemeFromConfig.ts`.

---

## File Location and Registration

| Path | Purpose |
|------|---------|
| `public/theme/default-theme.json` | Shipped with the app; used when no tenant theme is configured |
| `public/theme/<tenant>-theme.json` | Tenant-specific override |
| `src/theme/config/default-theme.json` | Bundled fallback; must stay in sync with the public copy |

Register a new theme file by adding its filename to `themeConfigs` in the relevant
environment bootstrap JSON (e.g. `public/dev.json`, `public/config.json`). The first entry
in the array is the default on first visit.

---

## Top-Level Metadata (required)

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "description": "Optional description",
  "author": "Team name"
}
```

`name` and `version` are required by `AbzuThemeConfig`. They appear in `useTheme().name`
and can be useful for debugging.

---

## `palette` — Colour Tokens

This is the most important section. All colours used in the application must trace back to a
token defined here. **Never hardcode hex values in component `sx` props** — use the token
name instead (`"primary.main"`, `"error.light"`, etc.).

### Required colour roles

Each role needs `main`, `dark`, `light`, and `contrastText`. MUI derives missing shades
automatically, but explicit values are safer for tenant themes.

```json
"palette": {
  "primary":   { "main": "#1976d2", "dark": "#115293", "light": "#42a5f5", "contrastText": "#ffffff" },
  "secondary": { "main": "#9c27b0", "dark": "#6a1b9a", "light": "#ba68c8", "contrastText": "#ffffff" },
  "tertiary":  { "main": "#00796b", "dark": "#004d40", "light": "#26a69a", "contrastText": "#ffffff" },
  "error":     { "main": "#d32f2f", "dark": "#c62828", "light": "#ef5350", "contrastText": "#ffffff" },
  "warning":   { "main": "#ed6c02", "dark": "#e65100", "light": "#ff9800", "contrastText": "#ffffff" },
  "info":      { "main": "#0288d1", "dark": "#01579b", "light": "#03a9f4", "contrastText": "#ffffff" },
  "success":   { "main": "#2e7d32", "dark": "#1b5e20", "light": "#4caf50", "contrastText": "#ffffff" },
  "background": { "default": "#fafafa", "paper": "#ffffff" },
  "text": {
    "primary":  "rgba(0, 0, 0, 0.87)",
    "secondary": "rgba(0, 0, 0, 0.6)",
    "disabled":  "rgba(0, 0, 0, 0.38)"
  }
}
```

### `tertiary` — Abzu augmented colour

`tertiary` is not a standard MUI palette role. It is type-augmented in
`src/theme/config/theme-config.d.ts`. Always provide it — the application uses it for
parking (P&R) markers and other UI elements that need a fourth semantic colour.

### `contrastText` rule

`contrastText` must be readable on top of `main`. Use `#ffffff` for dark backgrounds and
`#000000` for light backgrounds. MUI will not auto-calculate `contrastText` for
`tertiary`; always set it explicitly.

### Optional: `action` and `divider`

```json
"action": {
  "hover":             "rgba(0, 0, 0, 0.04)",
  "selected":          "rgba(0, 0, 0, 0.08)",
  "focus":             "rgba(0, 0, 0, 0.12)",
  "active":            "rgba(0, 0, 0, 0.56)",
  "disabled":          "rgba(0, 0, 0, 0.38)",
  "disabledBackground":"rgba(0, 0, 0, 0.12)"
},
"divider": "#e0e0e0"
```

---

## `typography`

```json
"typography": {
  "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
  "h1": { "fontSize": "2.5rem", "fontWeight": 300, "lineHeight": 1.2 },
  "h2": { "fontSize": "2rem",   "fontWeight": 300, "lineHeight": 1.2 },
  "h3": { "fontSize": "1.75rem","fontWeight": 400, "lineHeight": 1.3 },
  "h4": { "fontSize": "1.5rem", "fontWeight": 400, "lineHeight": 1.4 },
  "h5": { "fontSize": "1.25rem","fontWeight": 500, "lineHeight": 1.5 },
  "h6": { "fontSize": "1.125rem","fontWeight": 500,"lineHeight": 1.6 },
  "body1":   { "fontSize": "1rem",    "lineHeight": 1.5  },
  "body2":   { "fontSize": "0.875rem","lineHeight": 1.43 },
  "caption": { "fontSize": "0.75rem", "lineHeight": 1.66 },
  "button":  { "textTransform": "none", "fontWeight": 500 }
}
```

The `button` variant controls default button text styling across the app. `textTransform:
"none"` prevents MUI's default ALL-CAPS behaviour. This is the correct place for
`textTransform`; do **not** put it directly inside `components.MuiButton` (see the pitfalls
section).

---

## `shape`

```json
"shape": { "borderRadius": 4 }
```

This is the global base border-radius (in px). MUI multiplies it with a scale factor for
different components. Set it to `4` for a standard Material Design look, higher (e.g. `8`)
for a softer/rounder brand.

---

## `spacing`

```json
"spacing": 8
```

Base spacing unit in px. `theme.spacing(1)` → `8px`. Leave at `8` unless the brand
guidelines specify otherwise.

---

## `breakpoints`

```json
"breakpoints": {
  "xs": 0,
  "sm": 600,
  "md": 900,
  "lg": 1200,
  "xl": 1536
}
```

MUI defaults. Only override if the brand requires non-standard breakpoints.

---

## `environment` — Abzu custom field

Controls the environment badge shown in the header (dev/test/prod).

```json
"environment": {
  "development": { "color": "#457645", "showBadge": true,  "label": "DEV"  },
  "test":        { "color": "#ed6c02", "showBadge": true,  "label": "TEST" },
  "prod":        { "color": "#2e7d32", "showBadge": false, "label": "PROD" }
}
```

`color` is the badge background colour. `showBadge: false` in prod hides the badge
entirely.

---

## `assets` — Abzu custom field

```json
"assets": {
  "logo": "/my-logo.png",
  "logoHeight": { "xs": 32, "sm": 40, "md": 40 },
  "favicon": "/favicon.ico"
}
```

Logo paths are relative to `public/`. `logoHeight` is responsive (xs/sm/md breakpoints,
values in px).

---

## `components` — MUI Component Overrides

This is the section most prone to mistakes. Follow these rules strictly.

### The `defaultProps` / `styleOverrides` distinction

| What you want to set | Where it goes | Example |
|----------------------|--------------|---------|
| A React prop passed to every instance | `defaultProps` | `elevation`, `variant`, `disableElevation` |
| A CSS property applied via stylesheet | `styleOverrides.root` (or named slot) | `borderRadius`, `textTransform`, `fontWeight`, `color`, `backgroundColor` |

**Never put CSS properties directly at the component level.** MUI treats unknown top-level
keys as `defaultProps`, which forwards them as React props to the DOM element, producing
React warnings.

```jsonc
// WRONG — textTransform and borderRadius will become DOM props
"MuiButton": {
  "textTransform": "none",
  "borderRadius": 4
}

// CORRECT
"MuiButton": {
  "defaultProps": { "disableElevation": true },
  "styleOverrides": {
    "root": { "textTransform": "none", "borderRadius": 4, "fontWeight": 500 }
  }
}
```

### Standard component overrides

```json
"components": {
  "MuiButton": {
    "defaultProps": { "disableElevation": true },
    "styleOverrides": {
      "root": { "borderRadius": 4, "textTransform": "none", "fontWeight": 500 }
    }
  },
  "MuiCard": {
    "defaultProps": { "elevation": 1 },
    "styleOverrides": {
      "root": { "borderRadius": 4 }
    }
  },
  "MuiAppBar": {
    "defaultProps": { "elevation": 2 }
  },
  "MuiTextField": {
    "defaultProps": { "variant": "outlined" },
    "styleOverrides": {
      "root": { "borderRadius": 4 }
    }
  },
  "MuiAutocomplete": {
    "styleOverrides": {
      "root": {
        "&.Mui-expanded .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          "border": "0 !important"
        }
      },
      "paper": { "borderTop": "none" }
    }
  }
}
```

### Named slots in `styleOverrides`

MUI exposes multiple slots per component. Common ones:

| Component | Slot | What it targets |
|-----------|------|----------------|
| `MuiButton` | `root` | The `<button>` element |
| `MuiButton` | `containedPrimary` | Contained variant, primary colour |
| `MuiButton` | `outlinedPrimary` | Outlined variant, primary colour |
| `MuiAppBar` | `colorPrimary` | AppBar when `color="primary"` |
| `MuiChip` | `filled` / `filledPrimary` / `outlined` | Chip variants |
| `MuiAlert` | `standardSuccess` / `standardError` etc. | Alert severity variants |
| `MuiPaper` | `root` | All Paper-based surfaces |
| `MuiDialog` | `paper` | The dialog card surface |

---

## `customProperties` — Layout Constants

Optional bag of application-level layout values. Access via `theme.customProperties`.

```json
"customProperties": {
  "headerHeight": 64,
  "sidebarWidth": 260,
  "contentMaxWidth": 1200
}
```

---

## Creating a Minimal Tenant Theme

A tenant theme only needs to override what differs from the default. Unset keys fall back
to the default theme automatically.

Minimum viable tenant theme:

```json
{
  "name": "Tenant Theme",
  "version": "1.0.0",
  "palette": {
    "primary": { "main": "#005ea5", "dark": "#003f7a", "light": "#4a90d9", "contrastText": "#ffffff" }
  },
  "assets": {
    "logo": "/tenant-logo.png",
    "logoHeight": { "xs": 28, "sm": 36, "md": 36 },
    "favicon": "/favicon.ico"
  },
  "environment": {
    "development": { "color": "#005ea5", "showBadge": true, "label": "DEV" },
    "test":        { "color": "#f4a700", "showBadge": true, "label": "TEST" },
    "prod":        { "color": "#005ea5", "showBadge": false, "label": "PROD" }
  }
}
```

---

## Pitfalls Checklist

- [ ] **CSS props directly in component config** — use `styleOverrides.root`, not the component top level
- [ ] **Missing `tertiary` palette** — the app uses it for map markers and UI tokens; always define it
- [ ] **Missing `contrastText`** — always set explicitly on `tertiary`; MUI won't derive it automatically
- [ ] **Hardcoded colours in `styleOverrides`** — prefer palette tokens where possible (e.g. `containedPrimary` can reference `"$palette.primary.main"` in some setups, but plain hex is accepted)
- [ ] **`typography.button.textTransform` missing** — without this, all buttons render in ALL CAPS
- [ ] **Out-of-sync `public/` and `src/theme/config/` copies** — when editing `default-theme.json`, update both files
