# Theming Abzu

How to give a deployment its own colours, fonts, logo, favicon and environment badge —
without touching application code.

Everything here is driven by **one JSON file per theme** plus **one line of registration**.
The Entur theme (`public/theme/entur-theme.json`) is used throughout as the worked example.

> **Scope:** this covers the **modern UI** (`src/containers/modern/App.tsx`). The legacy UI
> has its own separate theme and is not configurable this way — see
> [Legacy UI](#legacy-ui) at the end.
>
> **MUI version: 9.3.0.** Component override slots changed in v9 — see
> [`components`](#components--mui-component-overrides) before copying overrides from older
> examples or from MUI v5/v6 documentation.

---

## 1. How it works

```
public/bootstrap.json                 →  which themes exist, and the default
  └─ "themeConfigs": [ "theme/entur-theme.json", … ]
        │
        ▼
public/theme/entur-theme.json         →  the theme itself (colours, fonts, assets, …)
        │
        ▼
AbzuThemeProvider (src/theme/ThemeProvider.tsx)
        │  fetches the JSON at runtime, then:
        ├─ createTheme(config)        →  MUI theme (palette, typography, components …)
        ├─ useThemeFonts()            →  injects @font-face into <head>
        ├─ useThemeBodyFont()         →  applies fontFamily to <body>
        └─ useThemeFavicon()          →  sets <link rel="icon">
```

Four things worth knowing up front:

1. **Themes are fetched at runtime**, not bundled. Editing a theme JSON needs only a reload.
2. **The whole config is passed to MUI's `createTheme`.** Any key MUI's `ThemeOptions`
   accepts works, even if it isn't documented here.
3. **There is no inheritance between themes.** See
   [No base theme](#no-base-theme-this-surprises-everyone) — this is the most common mistake.
4. **The user's choice persists** in `localStorage` under `abzu-selected-theme`.

---

## 2. Quick start

**Step 1 — copy an existing theme as your starting point:**

```bash
cp public/theme/entur-theme.json public/theme/mytransit-theme.json
```

**Step 2 — register it in `public/bootstrap.json`** (the last entry is the new one):

<!-- prettier-ignore -->
```json
{
  "themeConfigs": [
    "theme/default-theme.json",
    "theme/entur-theme.json",
    "theme/mytransit-theme.json"
  ]
}
```

**Step 3 — edit your theme file.** At minimum set `name`, `palette.primary` and
`assets.logo`.

**Step 4 — restart `npm start`**, then pick your theme from **header menu → Appearance**.

The switcher only appears when **two or more** themes are registered. The **first entry** is
what a new visitor gets.

---

## 3. Building a theme, field by field

Follow along in `public/theme/entur-theme.json`.

### Metadata

```json
{
  "name": "Entur Theme",
  "version": "1.0.0",
  "description": "Entur theme configuration for Abzu Stop Place Registry",
  "author": ""
}
```

`name` is metadata — used for logging and `useTheme().currentThemeName`. **It is not what
the theme switcher displays.** The switcher labels each option from the _filename_
(`entur-theme.json` → "Entur Theme"), because only the active theme's JSON is loaded and the
others have no `name` to read. **So name your file after the brand.**

### `palette` — colours

```json
{
  "palette": {
    "primary": {
      "main": "#181C56",
      "dark": "#0F1138",
      "light": "#4A4E7A",
      "contrastText": "#FFFFFF"
    },
    "secondary": {
      "main": "#FF5959",
      "dark": "#D93B3B",
      "light": "#FF8A8A",
      "contrastText": "#FFFFFF"
    },
    "error": {
      "main": "#D32F2F",
      "dark": "#B71C1C",
      "light": "#EF9A9A",
      "contrastText": "#FFFFFF"
    },
    "warning": {
      "main": "#ED6C02",
      "dark": "#E65100",
      "light": "#FFB74D",
      "contrastText": "#000000"
    },
    "info": {
      "main": "#1777F8",
      "dark": "#0D5FD9",
      "light": "#5BA0FA",
      "contrastText": "#FFFFFF"
    },
    "success": {
      "main": "#2E7D32",
      "dark": "#1B5E20",
      "light": "#81C784",
      "contrastText": "#FFFFFF"
    },
    "background": { "default": "#FFFFFF", "paper": "#FFFFFF" },
    "text": {
      "primary": "#000000",
      "secondary": "#505064",
      "disabled": "#9E9E9E"
    },
    "divider": "#E5E5E5"
  }
}
```

Components never hardcode colours — they reference tokens like `"primary.main"` and
`"warning.contrastText"`. The tokens actually used by the modern UI, most-used first:

| Token                                     | Used for                                                             |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `primary`                                 | Stop place markers, links, primary actions                           |
| `warning` + `warning.contrastText`        | Focused/selected map elements — **heavily used, set `contrastText`** |
| `text`, `divider`, `background`, `action` | Surfaces and typography                                              |
| `success`                                 | Quay markers                                                         |
| `info`                                    | Bike parking markers                                                 |
| `secondary`                               | Boarding position markers                                            |
| `error`                                   | Destructive actions, validation                                      |

Anything you omit falls back to **MUI's defaults**, which are perfectly usable — so a
minimal theme can define only `primary` and still work. `grey` and `common` are always
provided by MUI; you rarely need to set them.

**Dark mode.** Two options, both supported by MUI v9:

- **A dark theme** — set `"mode": "dark"` inside `palette`. MUI generates dark defaults for
  whatever you don't specify. Register it like any other theme; users pick it from the
  Appearance menu.
- **One theme carrying both schemes** — use `colorSchemes` with `cssVariables`, MUI v9's
  built-in mechanism.

For the second option:

```json
{
  "cssVariables": { "colorSchemeSelector": "class" },
  "colorSchemes": {
    "light": { "palette": { "primary": { "main": "#181C56" } } },
    "dark": { "palette": { "primary": { "main": "#8A8FD0" } } }
  }
}
```

Abzu has **no in-app light/dark toggle**, so with `colorSchemes` the browser/OS preference
decides. If you only need one appearance, `palette.mode` is simpler.

### `typography` and `fonts` — two separate jobs

This trips people up: **loading** a font and **using** it are different fields.

```json
{
  "fonts": {
    "faces": [
      {
        "family": "Inter",
        "src": "fonts/inter-variable-latin.woff2",
        "format": "woff2",
        "weight": "100 900",
        "style": "normal",
        "display": "swap",
        "unicodeRange": "U+0000-00FF, U+0131, …"
      }
    ]
  },
  "typography": {
    "fontFamily": "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
    "h1": { "fontSize": "3rem", "fontWeight": 700 },
    "button": { "textTransform": "none", "fontWeight": 600 }
  }
}
```

- `fonts.faces` → generates `@font-face` rules, i.e. **loads** the file
- `typography.fontFamily` → **applies** it

Set only `fontFamily` and the browser silently falls back to a system font. Set only
`fonts` and nothing uses it.

See [Adding a font](#5-adding-a-font) for how to obtain and place the files.

#### More than one font family

`fonts.faces` is a list, so a theme can load as many families as it likes — each entry
carries its own `family`. Declaring an extra family costs nothing until something actually
uses it: the browser downloads a face only when an element asks for it.

To give a family a **role**, add a named key under `typography`. MUI resolves `sx`'s
`fontFamily` through `theme.typography`, so a name defined there wins over the literal CSS
value:

```json
{
  "fonts": {
    "faces": [
      {
        "family": "Public Sans",
        "src": "fonts/public-sans-variable.woff2",
        "format": "woff2",
        "weight": "100 900"
      },
      {
        "family": "Roboto Mono",
        "src": "fonts/roboto-mono-latin.woff2",
        "format": "woff2",
        "weight": "100 700"
      }
    ]
  },
  "typography": {
    "fontFamily": "\"Public Sans\", sans-serif",
    "monospace": "\"Roboto Mono\", ui-monospace, Menlo, monospace"
  }
}
```

The app renders NeTEx IDs and quay codes with `sx={{ fontFamily: "monospace" }}`. With the
key above, those call sites pick up Roboto Mono automatically — **no code change**. A theme
that omits `typography.monospace` keeps the browser's default monospace, so this is
backwards compatible.

The same trick works for any role you want to theme: pick a name, define it under
`typography`, and use that name as the `fontFamily` value in `sx`.

### `assets` — logo and favicon

```json
{
  "assets": {
    "logo": "/entur-logo.png",
    "logoHeight": { "xs": 20, "sm": 24, "md": 24 },
    "favicon": "/entur-favicon.png"
  }
}
```

Paths are relative to `public/` and resolved against the app's base URL, so sub-path
deployments work. `logoHeight` is per-breakpoint, in px.

### `environment` — the DEV/TEST badge

```json
{
  "environment": {
    "development": { "color": "#457645", "showBadge": true, "label": "DEV" },
    "test": { "color": "#ffe082", "showBadge": true, "label": "TEST" },
    "prod": { "color": "#181c56", "showBadge": false, "label": "PROD" }
  }
}
```

Which block applies is decided by `window.config.tiamatEnv`. The keys must be exactly
`development`, `test`, `prod`. Omit the block entirely and no badge is shown.

### `components` — MUI component overrides

```json
{
  "components": {
    "MuiButton": {
      "defaultProps": { "disableElevation": true },
      "styleOverrides": {
        "root": {
          "textTransform": "none",
          "borderRadius": 4,
          "fontWeight": 600
        }
      }
    },
    "MuiAppBar": {
      "styleOverrides": {
        "colorPrimary": { "backgroundColor": "#000000", "color": "#FFFFFF" }
      }
    }
  }
}
```

**Rule 1 — React props go in `defaultProps`, CSS goes in `styleOverrides`.** MUI treats
unknown top-level keys as `defaultProps` and forwards them to the DOM, producing React
warnings and no styling.

```jsonc
// WRONG — becomes a DOM attribute
"MuiButton": { "textTransform": "none" }

// RIGHT
"MuiButton": { "styleOverrides": { "root": { "textTransform": "none" } } }
```

**Rule 2 — there are no compound variant+colour slots.** This is the MUI v9 change most
likely to bite you. v9 splits variant and colour into **separate classes**, so slots like
`containedPrimary` simply do not exist and an override using one is silently ignored — no
error, no styling.

| Component   | Does **not** exist in v9                             | Real slots in v9                                                                                                             |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `MuiButton` | `containedPrimary`, `outlinedPrimary`, `textPrimary` | `contained`, `outlined`, `text`, `colorPrimary`, `colorSecondary`, `colorError`, `colorInfo`, `colorSuccess`, `colorWarning` |
| `MuiChip`   | `filledPrimary`                                      | `filled`, `outlined`, `colorPrimary`, …                                                                                      |
| `MuiAlert`  | `standardSuccess`, `standardError`, …                | `standard`, `filled`, `outlined`, `colorSuccess`, `colorError`, …                                                            |

To style a **combination**, use the `variants` array — it sits beside `styleOverrides` and is
plain JSON, so it works fine from a theme file:

```json
{
  "MuiButton": {
    "defaultProps": { "disableElevation": true },
    "styleOverrides": {
      "root": { "textTransform": "none", "borderRadius": 4, "fontWeight": 600 }
    },
    "variants": [
      {
        "props": { "variant": "contained", "color": "primary" },
        "style": { "backgroundColor": "#1777F8", "color": "#FFFFFF" }
      },
      {
        "props": { "variant": "outlined", "color": "primary" },
        "style": { "borderColor": "#1777F8", "color": "#1777F8" }
      }
    ]
  }
}
```

Slots that **do** exist and are safe to use: `MuiAppBar.colorPrimary`, `MuiDialog.paper`,
`MuiPaper.root`, `MuiChip.filled` / `outlined`, `MuiCssBaseline.body`, and every
component's `root`.

To check a slot name rather than guess, read the class list:

```bash
grep -oE "^\s+[a-zA-Z]+:" node_modules/@mui/material/Button/buttonClasses.d.ts
```

**Rule 3 — `defaultProps` can only set props that still exist.** MUI v9 removed some, so a
theme setting them does nothing (and may type-error). Notably `Dialog`'s
`disableEscapeKeyDown` is gone, and `TextField`'s `InputProps` / `inputProps` are replaced by
`slotProps: { input, htmlInput }`.

### Other supported keys

`shape` (`{ "borderRadius": 4 }`), `spacing` (`8`), `breakpoints`, and
`customProperties` (a free-form bag readable at `theme.customProperties`). Anything else
MUI's `createTheme` accepts also works.

---

## 4. Registering the theme

`themeConfigs` lives in the bootstrap config. The **first entry** is the default for new
visitors.

<!-- prettier-ignore -->
```json
{
  "themeConfigs": [
    "theme/default-theme.json",
    "theme/entur-theme.json",
    "theme/fintraffic-theme.json"
  ]
}
```

**`public/bootstrap.json` is gitignored and generated at deploy time.** The deploy workflow
does `cp .github/environments/dev.json build/bootstrap.json`. So:

- **Local development:** edit `public/bootstrap.json` (or run `./copy-dev-config.sh`)
- **Deployments:** edit the environment file in `.github/environments/`, or your own private
  deployment config

Because it's deployment-generated, a private deployment can register a theme JSON that
doesn't exist in this repository at all — useful for licence-restricted assets
(see [Licensed fonts](#licensed-fonts)).

---

## 5. Adding a font

Self-host. Don't reference an external CDN: it adds a runtime dependency on someone else's
uptime, and sending visitor IPs to a third party is a GDPR problem for a public authority.

### Steps

1. Get a **woff2** file. Skip `eot` (IE-only) and `woff` (pre-2016 fallback).
   A _variable_ font is ideal — one file covers every weight.
2. Put it in `public/fonts/`.
3. Add a `fonts.faces` entry and prepend the family to `typography.fontFamily`.

Google Fonts is a convenient source of openly-licensed fonts. Fetch the CSS, then download
the `latin` (and `latin-ext` if you need Nordic/extended glyphs) woff2 files it references
and copy the `unicode-range` values across. Declaring both subsets costs nothing: the
browser only downloads `latin-ext` when a character in that range actually appears.

### What's already in the repo

| Theme                   | Font                                      | Licence              |
| ----------------------- | ----------------------------------------- | -------------------- |
| `default-theme.json`    | Roboto (variable)                         | Apache 2.0           |
| `entur-theme.json`      | Inter (variable)                          | OFL 1.1              |
| `fintraffic-theme.json` | Public Sans + Roboto Mono (both variable) | OFL 1.1 / Apache 2.0 |

### Licensed fonts

**Do not commit a licence-restricted font to this repository.** `entur/abzu` is public,
EUPL-licensed, and forked by other organisations — committing a proprietary font
redistributes it to all of them.

Entur's brand font _Nationale_ (Playtype Foundry, via `@entur/typography`) may only be used
in official Entur products. For that case:

- Keep the files out of git — `.gitignore` already blocks `public/fonts/Entur-Nationale-*`
- Have your private deployment config copy them into `build/fonts/` at deploy time, next to
  the `bootstrap.json` copy step
- Keep the `fonts` block in a **private theme JSON** so the public repo carries no reference
  to it

If a font file is missing, `font-display: swap` plus the fallback chain means text still
renders in the next font down. It degrades, it doesn't break.

---

## 6. Gotchas

### No base theme (this surprises everyone)

`createThemeFromConfig` is `createTheme(config)` — **one** config. Your theme is **not**
merged with `default-theme.json`. Unset keys fall back to **MUI's defaults**, not to Abzu's
default theme.

That's fine — MUI's defaults are sane — but it means you cannot write a theme that "only
overrides what differs from the Abzu default". If you want Abzu's default look as a base,
copy the file and edit it.

### The switcher label comes from the filename

Not from `name`. `theme/mytransit-theme.json` shows as "Mytransit Theme". Name files after
the brand.

### An image with the wrong bytes fails silently

A file named `.png` that actually contains AVIF or WebP data will be served as
`image/png`, rejected by the browser, and **your old favicon stays in the tab** — no console
error. If a logo or favicon doesn't appear, check the bytes first:

```bash
file public/my-favicon.png     # must say "PNG image data"
sips -s format png in.avif --out out.png    # macOS: convert if not
```

### Fonts need two fields

Covered above, but it's the most common "why isn't my font working": `fonts` loads,
`typography.fontFamily` applies.

### Legacy CSS owns `<body>`

`src/styles/main.css` sets `body { font-family: sans-serif }`, and `StyledEngineProvider
injectFirst` places MUI's styles _before_ it, so that rule would win. `useThemeBodyFont`
works around it with an inline style. Relevant only if you're debugging why `<body>` looks
different from MUI components.

### What happens when a theme fails to load

| Failure                        | Result                                                                    |
| ------------------------------ | ------------------------------------------------------------------------- |
| Fetch fails / 404              | `console.error`, then the legacy fallback theme (`createAbzuThemeLegacy`) |
| Invalid JSON                   | same as above                                                             |
| `createTheme` throws           | `console.warn`, then plain `createTheme()`                                |
| `themeConfigs` absent or empty | plain `createTheme()` — standard MUI look                                 |

The app never white-screens on a bad theme, so check the console if your theme seems ignored.

---

## 7. Verification checklist

With `npm start` running, switch to your theme via **header menu → Appearance**:

- [ ] Header logo is yours (`assets.logo`)
- [ ] Browser tab icon is yours (`assets.favicon`) — a distinct icon file, or you won't see a change
- [ ] Environment badge shows with the right label and colour
- [ ] Primary-coloured elements use your brand colour
- [ ] **DevTools → Computed → Rendered Fonts** shows your font, not a fallback
- [ ] `<head>` contains `<style data-abzu-theme-font>` with your `@font-face`
- [ ] Switching away removes that `<style>` element
- [ ] Console has no theme errors
- [ ] Long labels still fit — a font with wider metrics than Roboto can overflow the search field

---

## 8. What lives where

The theme system is deliberately small. This is all of it:

| File                                        | Role                                                              |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `public/theme/*.json`                       | The themes themselves — the only files you normally edit          |
| `src/theme/ThemeProvider.tsx`               | Fetches the active theme, owns the context, calls the hooks below |
| `src/theme/config/createThemeFromConfig.ts` | `createTheme(config)` — the whole conversion                      |
| `src/theme/config/theme-config.d.ts`        | `AbzuThemeConfig` type and MUI module augmentation                |
| `src/theme/fonts/useThemeFonts.ts`          | Injects `@font-face` from `fonts`                                 |
| `src/theme/fonts/useThemeBodyFont.ts`       | Applies `typography.fontFamily` to `<body>`                       |
| `src/theme/assets/useThemeFavicon.ts`       | Sets `<link rel="icon">` from `assets.favicon`                    |
| `src/theme/components/ThemeSwitcher.tsx`    | The Appearance-menu dropdown                                      |
| `src/theme/base.ts`, `variants/light.ts`    | Legacy fallback theme, used only when a theme JSON fails to load  |

Two notes on things that are _not_ here:

- **`palette.tertiary`** is type-augmented and set in two theme files, but no component
  references it. Harmless to include, safe to omit.
- There is **no theme loader, validator, bundled fallback JSON, dark-variant file, or
  light/dark toggle component**. Earlier versions of this system had all five; they were
  never wired up and have been removed. If you find a reference to `loadThemeConfig`,
  `theme-variants-config.json`, `variants/dark.ts` or `ThemeModeSwitcher`, it is stale.

---

## Legacy UI

The legacy UI (`src/containers/LegacyApp.jsx`) does **not** use this system. It builds its
own MUI theme from `src/config/themeConfig.js`, and a deployment can override its styling with
the `<extPath>/CustomStyle` and `<extPath>/CustomThemeProvider` ext features.

`CustomStyle` is mounted **inside `LegacyApp.jsx` only**, deliberately — it injects a global
stylesheet full of `!important` rules that would otherwise override the modern UI's theme.
Do not hoist it above the legacy/modern split. Retiring the legacy app removes it
automatically.

---

## For an AI agent

Task: _add a theme for deployment `<X>` with brand colour `<C>`, logo `<L>`, font `<F>`._

```
FILES TO CREATE / EDIT
  public/theme/<x>-theme.json      new; copy public/theme/entur-theme.json as the template
  public/<x>-logo.png              logo asset (verify with `file` that bytes match extension)
  public/<x>-favicon.png           favicon asset (same check)
  public/fonts/<font>.woff2        font file, woff2 only, variable preferred
  public/bootstrap.json            append "theme/<x>-theme.json" to themeConfigs

DO NOT EDIT
  any file under src/            adding a theme requires no code changes at all

THEME JSON SHAPE (all keys optional except name/version)
  name, version, description, author        metadata; switcher label comes from the FILENAME
  palette{primary,secondary,error,warning,info,success,background,text,divider,action,mode}
                                            omitted keys fall back to MUI defaults, NOT to
                                            default-theme.json — there is no theme inheritance
  typography{fontFamily, h1..h6, body1, body2, button{textTransform,fontWeight},
             <roleName>}                  a named key here is resolvable from sx:
                                          sx={{fontFamily:"monospace"}} picks up
                                          typography.monospace. Used for NeTEx IDs.
  fonts{faces:[{family,src,format,weight,style,display,unicodeRange}], stylesheets:[url]}
                                            `faces` LOADS the font; typography.fontFamily USES it.
                                            src is relative to public/ (e.g. "fonts/x.woff2")
  assets{logo, logoHeight{xs,sm,md}, favicon}   paths relative to public/, leading slash ok
  environment{development,test,prod}{color,showBadge,label}   keys must be exactly these
  components{Mui*}{defaultProps{}, styleOverrides{slot:{}}, variants:[{props,style}]}
                                            CSS MUST go inside styleOverrides, never at the
                                            component's top level.
                                            MUI v9 has NO compound variant+colour slots:
                                            containedPrimary / outlinedPrimary / filledPrimary /
                                            standardSuccess do NOT exist and are silently
                                            ignored. Target combinations with `variants`:
                                            {"props":{"variant":"contained","color":"primary"},
                                             "style":{...}}
                                            Verify a slot name before using it:
                                            grep -oE '^\s+[a-zA-Z]+:' \
                                              node_modules/@mui/material/Button/buttonClasses.d.ts
  shape{borderRadius}, spacing, breakpoints, customProperties{}
  cssVariables + colorSchemes{light,dark}   optional; MUI v9 light/dark in one theme

VERIFY
  npx tsc --noEmit                          must pass (should be unaffected)
  npx prettier --write <edited files>
  reload app, switch theme via header menu → Appearance
  DevTools → Computed → Rendered Fonts shows <F>, not a fallback
  <head> has <style data-abzu-theme-font>; it disappears when switching away
  no theme errors in console

CONSTRAINTS
  never commit a licence-restricted font to this public repo
  woff2 only; skip eot/woff
  a .png/.jpg whose bytes are AVIF/WebP fails silently — check with `file`
```
