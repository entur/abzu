# Abzu Theme Configuration System

This directory contains the configuration-driven theme system for Abzu, inspired by the Inanna project. The system allows for build-time theme customization through JSON configuration files.

## Overview

The theme configuration system provides:

- **Build-time theme customization** through JSON configuration files
- **Environment-specific styling** with automatic badge display
- **Component-level customization** for consistent styling
- **Validation and error handling** for configuration files
- **Backward compatibility** with the existing theme system

## Architecture

```
config/
├── types.ts                       # TypeScript type definitions
├── loader.ts                      # Configuration loading and caching
├── converter.ts                   # Config to MUI theme conversion
├── default-theme-config.json      # Default theme configuration
├── theme-variants-config.json     # Light/dark variant overrides
├── custom-theme-example.json      # Example custom theme
└── README.md                      # This documentation
```

## Configuration Structure

### Main Theme Configuration

```typescript
interface AbzuThemeConfig {
  name: string; // Theme name
  version: string; // Theme version
  description?: string; // Theme description
  author?: string; // Theme author

  palette: {
    // Color palette
    primary: { main: string /* ... */ };
    secondary: { main: string /* ... */ };
    tertiary?: { main: string /* ... */ };
    // ... other colors
  };

  typography?: {
    // Typography settings
    fontFamily?: string;
    h1?: { fontSize?: string /* ... */ };
    // ... other text styles
  };

  shape?: {
    // Shape settings
    borderRadius?: number;
  };

  spacing?: number; // Base spacing unit

  breakpoints?: {
    // Responsive breakpoints
    xs?: number;
    sm?: number /* ... */;
  };

  environment?: {
    // Environment-specific styling
    development?: { color: string; showBadge?: boolean };
    test?: { color: string; showBadge?: boolean };
    prod?: { color: string; showBadge?: boolean };
  };

  assets?: {
    // Asset paths
    logo?: string;
    favicon?: string;
  };

  components?: {
    // Component customizations
    MuiButton?: {
      /* ... */
    };
    MuiCard?: {
      /* ... */
    };
    // ... other components
  };

  customProperties?: Record<string, any>; // Custom CSS variables
}
```

### Theme Variants Configuration

The `theme-variants-config.json` file contains overrides for light and dark variants:

```json
{
  "light": {
    "palette": {
      "background": { "default": "#fafafa", "paper": "#ffffff" }
    }
  },
  "dark": {
    "palette": {
      "background": { "default": "#121212", "paper": "#1e1e1e" }
    }
  }
}
```

## Usage

### 1. Using the Default Theme

The system automatically loads the default theme configuration:

```tsx
import { AbzuThemeProvider } from "../theme/ThemeProvider";

function App() {
  return (
    <AbzuThemeProvider>
      <YourApp />
    </AbzuThemeProvider>
  );
}
```

### 2. Using a Custom Configuration

Create a custom theme configuration file and specify it via environment variable:

```bash
# Build with custom theme
VITE_THEME_CONFIG=./custom-theme.json npm run build
```

### 3. Programmatic Theme Creation

```tsx
import { createAbzuTheme } from "../theme";
import customConfig from "./my-theme-config.json";

const theme = await createAbzuTheme({
  variant: "light",
  environment: "development",
  config: customConfig,
});
```

### 4. Legacy Theme Fallback

For backward compatibility, use the legacy theme system:

```tsx
<AbzuThemeProvider useConfigFiles={false}>
  <YourApp />
</AbzuThemeProvider>
```

## Build-Time Configuration

### Environment Variables

- `VITE_THEME_CONFIG`: Path to custom theme configuration file
- `VITE_THEME_VARIANT`: Default theme variant ('light' | 'dark')

### Vite Configuration

```javascript
// vite.config.js
export default {
  define: {
    "process.env.THEME_CONFIG": JSON.stringify(process.env.THEME_CONFIG),
  },
  // ... other config
};
```

## Creating Custom Themes

### 1. Start with the Example

Copy `custom-theme-example.json` as a starting point:

```bash
cp src/theme/config/custom-theme-example.json my-custom-theme.json
```

### 2. Customize Colors

```json
{
  "palette": {
    "primary": {
      "main": "#your-primary-color",
      "dark": "#your-primary-dark",
      "light": "#your-primary-light"
    }
  }
}
```

### 3. Customize Typography

```json
{
  "typography": {
    "fontFamily": "\"Your Font\", \"Helvetica\", sans-serif",
    "h1": {
      "fontSize": "3rem",
      "fontWeight": 700
    }
  }
}
```

### 4. Customize Components

```json
{
  "components": {
    "MuiButton": {
      "borderRadius": 20,
      "textTransform": "none"
    }
  }
}
```

### 5. Add Custom Properties

```json
{
  "customProperties": {
    "headerHeight": 80,
    "primaryGradient": "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  }
}
```

## Environment-Specific Styling

Configure different colors for each environment:

```json
{
  "environment": {
    "development": {
      "color": "#4caf50",
      "showBadge": true
    },
    "test": {
      "color": "#ff9800",
      "showBadge": true
    },
    "prod": {
      "color": "#2196f3",
      "showBadge": false
    }
  }
}
```

## Validation and Error Handling

The system includes comprehensive validation:

- **Required fields**: name, version, primary colors
- **Color format validation**: Hex colors and rgba() format
- **Breakpoint order validation**: Ensures proper responsive breakpoint order
- **Type safety**: Full TypeScript support

### Validation Errors

```typescript
interface ThemeConfigValidationError {
  field: string; // Field path (e.g., "palette.primary.main")
  message: string; // Error message
  value?: any; // Invalid value
}
```

## Migration from Legacy Theme

### Step 1: Enable Configuration System

```tsx
// Replace legacy theme provider
<AbzuThemeProvider useConfigFiles={true}>
  <App />
</AbzuThemeProvider>
```

### Step 2: Extract Current Theme to Config

Convert your existing theme customizations to the JSON configuration format.

### Step 3: Test and Validate

Use the validation system to ensure your configuration is correct:

```typescript
import { validateThemeConfig } from "./config/loader";

const errors = validateThemeConfig(myConfig);
if (errors.length > 0) {
  console.error("Theme validation errors:", errors);
}
```

## Advanced Features

### CSS Variables Generation

Custom properties are automatically converted to CSS variables:

```json
{
  "customProperties": {
    "headerHeight": 64,
    "primaryColor": "#1976d2"
  }
}
```

Becomes:

```css
:root {
  --abzu-header-height: 64px;
  --abzu-primary-color: #1976d2;
}
```

### Theme Caching

The system includes intelligent caching to prevent unnecessary theme recreations:

```typescript
import { clearThemeConfigCache } from "../theme";

// Clear cache during development
if (process.env.NODE_ENV === "development") {
  clearThemeConfigCache();
}
```

### Runtime Theme Switching

```tsx
const { setThemeVariant } = useTheme();

// Switch between light and dark
setThemeVariant("dark");
```

## Best Practices

1. **Keep configurations focused**: Don't override everything, just what you need to customize
2. **Use semantic colors**: Define meaningful color names in custom properties
3. **Test across environments**: Ensure your theme works in dev, test, and production
4. **Validate configurations**: Always run validation before deployment
5. **Document customizations**: Include description and author in your theme configs

## Troubleshooting

### Common Issues

1. **Theme not loading**: Check console for validation errors
2. **Colors not applying**: Verify color format (hex or rgba)
3. **Components not styled**: Ensure component names match MUI component names
4. **Build errors**: Check TypeScript types and configuration structure

### Debug Mode

Enable detailed logging:

```typescript
// Set in development environment
window.__ABZU_THEME_DEBUG__ = true;
```
