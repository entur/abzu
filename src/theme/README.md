# Abzu Theme Configuration System

A flexible, JSON-based theming system for customizing the Abzu Stop Place Registry application using Material-UI (MUI) components.

## Overview

The Abzu theme system allows organizations to customize the look and feel of the application through simple JSON configuration files. No code changes are required - just provide a theme configuration file and reference it in your environment config.

## Features

- **JSON-based configuration** - Easy to create and maintain without coding
- **Complete MUI theme coverage** - Customize colors, typography, spacing, shapes, and components
- **Environment-specific styling** - Different colors and badges for dev/test/prod environments
- **Light/dark mode support** - Automatic theme variant handling
- **Type-safe** - Full TypeScript support with validation
- **Asset customization** - Use your own logos and favicons
- **Custom properties** - Extend with your own theme properties

## Quick Start

### 1. Create Your Theme File

Create a JSON file with your theme configuration (e.g., `my-company-theme.json`):

```json
{
  "name": "My Company Theme",
  "version": "1.0.0",
  "description": "Custom theme for my organization",
  "author": "My Company",
  "palette": {
    "primary": {
      "main": "#1976d2",
      "dark": "#115293",
      "light": "#42a5f5",
      "contrastText": "#fff"
    },
    "secondary": {
      "main": "#9c27b0",
      "dark": "#6a1b9a",
      "light": "#ba68c8",
      "contrastText": "#fff"
    }
  }
}
```

### 2. Reference in Environment Config

Add the `themeConfig` property to your environment configuration file (e.g., `public/config.json`):

```json
{
  "tiamatBaseUrl": "https://api.example.com/...",
  "themeConfig": "src/theme/config/my-company-theme.json"
}
```

### 3. Run the Application

The theme will be automatically loaded and applied when the application starts.

## Theme Configuration Reference

### Required Fields

```json
{
  "name": "Theme Name",
  "version": "1.0.0",
  "palette": {
    "primary": {
      "main": "#1976d2"
    },
    "secondary": {
      "main": "#9c27b0"
    }
  }
}
```

### Complete Configuration Schema

#### Metadata

```json
{
  "name": "string (required)",
  "version": "string (required)",
  "description": "string (optional)",
  "author": "string (optional)"
}
```

#### Palette

Define your color scheme:

```json
{
  "palette": {
    "primary": {
      "main": "#1976d2",
      "light": "#42a5f5",
      "dark": "#115293",
      "contrastText": "#ffffff"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#ba68c8",
      "dark": "#6a1b9a",
      "contrastText": "#ffffff"
    },
    "tertiary": {
      "main": "#00796b",
      "light": "#26a69a",
      "dark": "#004d40",
      "contrastText": "#ffffff"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#ef5350",
      "dark": "#c62828"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ff9800",
      "dark": "#e65100"
    },
    "info": {
      "main": "#0288d1",
      "light": "#03a9f4",
      "dark": "#01579b"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#4caf50",
      "dark": "#1b5e20"
    },
    "background": {
      "default": "#fafafa",
      "paper": "#ffffff"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    }
  }
}
```

#### Typography

Customize fonts and text styles:

```json
{
  "typography": {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "h1": {
      "fontSize": "2.5rem",
      "fontWeight": 300,
      "lineHeight": 1.2
    },
    "h2": {
      "fontSize": "2rem",
      "fontWeight": 300,
      "lineHeight": 1.2
    },
    "h3": {
      "fontSize": "1.75rem",
      "fontWeight": 400,
      "lineHeight": 1.3
    },
    "h4": {
      "fontSize": "1.5rem",
      "fontWeight": 400,
      "lineHeight": 1.4
    },
    "h5": {
      "fontSize": "1.25rem",
      "fontWeight": 500,
      "lineHeight": 1.5
    },
    "h6": {
      "fontSize": "1.125rem",
      "fontWeight": 500,
      "lineHeight": 1.6
    },
    "body1": {
      "fontSize": "1rem",
      "lineHeight": 1.5
    },
    "body2": {
      "fontSize": "0.875rem",
      "lineHeight": 1.43
    },
    "button": {
      "textTransform": "none",
      "fontWeight": 500
    },
    "caption": {
      "fontSize": "0.75rem",
      "lineHeight": 1.66
    }
  }
}
```

#### Shape & Spacing

Control border radius and spacing scale:

```json
{
  "shape": {
    "borderRadius": 4
  },
  "spacing": 8
}
```

- `borderRadius`: Base border radius in pixels (default: 4)
- `spacing`: Spacing unit multiplier in pixels (default: 8)

#### Breakpoints

Define responsive breakpoints:

```json
{
  "breakpoints": {
    "xs": 0,
    "sm": 600,
    "md": 900,
    "lg": 1200,
    "xl": 1536
  }
}
```

#### Environment Configuration

Customize appearance for different environments:

```json
{
  "environment": {
    "development": {
      "color": "#1976d2",
      "showBadge": true
    },
    "test": {
      "color": "#ed6c02",
      "showBadge": true
    },
    "prod": {
      "color": "#2e7d32",
      "showBadge": false
    }
  }
}
```

- `color`: Primary color for the environment
- `showBadge`: Whether to show environment badge in UI

#### Assets

Customize logo and favicon:

```json
{
  "assets": {
    "logo": "/logo.png",
    "favicon": "/favicon.ico"
  }
}
```

Place your assets in the `public` directory.

#### Component Customization

Override default MUI component styles:

```json
{
  "components": {
    "MuiButton": {
      "borderRadius": 4,
      "textTransform": "none",
      "fontWeight": 500
    },
    "MuiCard": {
      "elevation": 1,
      "borderRadius": 4
    },
    "MuiAppBar": {
      "elevation": 2
    },
    "MuiTextField": {
      "variant": "outlined",
      "borderRadius": 4
    },
    "MuiAutocomplete": {
      "styleOverrides": {
        "root": {
          "&.Mui-expanded .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            "border": "0 !important"
          }
        },
        "paper": {
          "borderTop": "none"
        },
        "popper": {
          "[data-popper-placement*='bottom']": {
            "marginTop": 8
          }
        }
      }
    }
  }
}
```

#### Custom Properties

Add your own custom properties for use in the application:

```json
{
  "customProperties": {
    "headerHeight": 64,
    "sidebarWidth": 260,
    "contentMaxWidth": 1200,
    "brandGradient": "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    "cardShadow": "0 4px 20px rgba(25, 118, 210, 0.15)"
  }
}
```

Access these in your application via the theme context.

## Example Themes

### Default Theme

The application comes with a neutral default theme (`default-theme.json`) based on Material Design 3 principles.

**Colors:**

- Primary: Blue (#1976d2)
- Secondary: Purple (#9c27b0)
- Tertiary: Teal (#00796b)

**Use case:** General purpose, neutral branding

### Entur Theme

The Entur-branded theme (`entur-theme.json`) uses Entur's official brand colors.

**Colors:**

- Primary: Entur Green (#5AC39A)
- Secondary: Entur Navy (#181C56)
- Tertiary: Entur Teal (#41c0c4)

**Use case:** Entur-branded deployments

### Custom Example

The `custom-theme-example.json` demonstrates advanced customization including:

- Custom font family (Inter)
- Uppercase button text
- Larger border radius
- Custom spacing
- Extended custom properties

## Runtime Theme Switching

The theme system supports switching between different themes at runtime without reloading the application.

### Switching Between Theme Configs

You can allow users to switch between different theme configurations (e.g., from Default to Entur theme):

```tsx
import { ThemeSwitcher } from "../theme/components/ThemeSwitcher";

function SettingsMenu() {
  return <ThemeSwitcher variant="outlined" size="small" label="Select Theme" />;
}
```

The `ThemeSwitcher` component provides a dropdown menu with all available themes. The selected theme is automatically saved to localStorage and persisted across sessions.

**Available Props:**

- `variant`: "standard" | "outlined" | "filled" (default: "outlined")
- `size`: "small" | "medium" (default: "small")
- `fullWidth`: boolean (default: false)
- `label`: string (default: "Theme")

### Programmatic Theme Switching

You can also switch themes programmatically:

```tsx
import { useTheme } from "../theme/ThemeProvider";

function MyComponent() {
  const { switchThemeConfig, availableThemes, currentThemeName } = useTheme();

  const handleSwitchToEntur = async () => {
    await switchThemeConfig("src/theme/config/entur-theme.json");
  };

  return (
    <div>
      <p>Current theme: {currentThemeName}</p>
      <button onClick={handleSwitchToEntur}>Switch to Entur Theme</button>
    </div>
  );
}
```

**Available Context Values:**

- `availableThemes`: Array of theme file paths
- `currentThemeName`: Name of the currently loaded theme
- `switchThemeConfig(themePath)`: Function to switch to a different theme

## Light and Dark Mode

The theme system supports both light and dark modes. Configure variant-specific overrides in `theme-variants-config.json`:

```json
{
  "light": {
    "palette": {
      "background": {
        "default": "#fafafa",
        "paper": "#ffffff"
      },
      "text": {
        "primary": "rgba(0, 0, 0, 0.87)",
        "secondary": "rgba(0, 0, 0, 0.6)"
      }
    }
  },
  "dark": {
    "palette": {
      "background": {
        "default": "#121212",
        "paper": "#1e1e1e"
      },
      "text": {
        "primary": "#ffffff",
        "secondary": "rgba(255, 255, 255, 0.7)"
      }
    }
  }
}
```

### Switching Light/Dark Mode

Use the `ThemeModeSwitcher` component for toggling between light and dark modes:

```tsx
import { ThemeModeSwitcher } from "../theme/components/ThemeModeSwitcher";

function Header() {
  return <ThemeModeSwitcher showTooltip size="medium" />;
}
```

Or programmatically:

```tsx
import { useTheme } from "../theme/ThemeProvider";

function MyComponent() {
  const { themeVariant, setThemeVariant } = useTheme();

  const toggleMode = () => {
    setThemeVariant(themeVariant === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleMode}>
      Switch to {themeVariant === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
```

## Development

### Testing Your Theme

1. **Using Environment Variable:**

   ```bash
   VITE_THEME_CONFIG=src/theme/config/my-theme.json npm start
   ```

2. **Using Config File:**
   - Edit your environment config (e.g., `public/dev.json`)
   - Add `"themeConfig": "src/theme/config/my-theme.json"`
   - Run `npm start`

3. **Hot Reload:**
   - Theme changes require a page refresh
   - Save your theme JSON file
   - Refresh the browser to see changes

### Validation

The theme loader automatically validates your configuration:

- Required fields are present
- Colors are in valid format (hex or rgba)
- Breakpoints are in ascending order
- Structure matches the TypeScript schema

Validation errors will appear in the browser console during development.

### Debugging

Enable theme debugging in the console:

```javascript
// In browser console
localStorage.setItem("debug-theme", "true");
// Reload page
```

This will log:

- Theme loading process
- Validation results
- Final merged theme object

## File Structure

```
src/theme/
├── README.md                           # This file
├── config/
│   ├── default-theme.json              # Default neutral theme
│   ├── entur-theme.json                # Entur-branded theme
│   ├── custom-theme-example.json       # Example custom theme
│   ├── theme-variants-config.json      # Light/dark mode variants
│   ├── types.ts                        # TypeScript type definitions
│   ├── loader.ts                       # Theme loading logic
│   └── converter.ts                    # Theme conversion utilities
├── components/
│   ├── ThemeSwitcher.tsx               # Theme config switcher component
│   ├── ThemeModeSwitcher.tsx           # Light/dark mode toggle component
│   └── index.ts                        # Component exports
├── ThemeProvider.tsx                   # React theme provider
├── base.ts                             # Base theme configuration
├── variants/
│   ├── light.ts                        # Light mode theme
│   └── dark.ts                         # Dark mode theme
├── hooks.ts                            # Theme-related hooks
├── utils.ts                            # Theme utility functions
└── index.ts                            # Main export
```

## Best Practices

### Color Selection

1. **Use color tools:**
   - [Material Design Color Tool](https://material.io/resources/color/)
   - [Coolors](https://coolors.co/)
   - [Adobe Color](https://color.adobe.com/)

2. **Ensure sufficient contrast:**
   - Text on background: minimum 4.5:1 contrast ratio
   - Use light/dark variants for hover states
   - Test with a contrast checker

3. **Define a complete palette:**
   - Always provide main, light, and dark variants
   - Include contrastText for readability
   - Consider accessibility (WCAG AA compliance)

### Typography

1. **Font loading:**
   - Use web-safe fonts as fallbacks
   - Load custom fonts via CSS or Google Fonts
   - Test performance impact

2. **Hierarchy:**
   - Maintain clear visual hierarchy with h1-h6
   - Use consistent line heights
   - Consider readability at different screen sizes

3. **Font sizes:**
   - Use rem units for accessibility
   - Test on different devices
   - Ensure minimum 14px for body text

### Spacing & Layout

1. **Consistent spacing:**
   - Use the spacing multiplier consistently
   - Common values: 1x, 2x, 3x, 4x, 6x, 8x
   - Avoid arbitrary values

2. **Border radius:**
   - Keep consistent across components
   - Consider brand guidelines
   - Typical values: 4px (standard), 8px (rounded), 16px (very rounded)

### Component Overrides

1. **Start minimal:**
   - Override only what's necessary
   - Let MUI defaults handle the rest
   - Test across different components

2. **Use styleOverrides carefully:**
   - Complex overrides can break responsiveness
   - Test with light and dark modes
   - Consider using component props instead

### Version Control

1. **Semantic versioning:**
   - Increment version when making changes
   - Document breaking changes
   - Keep a changelog

2. **Git management:**
   - Commit theme files separately
   - Document rationale for changes
   - Test before committing

## Troubleshooting

### Theme Not Loading

1. Check the browser console for errors
2. Verify the theme file path in environment config
3. Ensure JSON is valid (use a JSON validator)
4. Check that required fields are present

### Colors Not Applying

1. Verify hex color format (#RRGGBB)
2. Check browser DevTools for applied styles
3. Clear browser cache
4. Ensure specificity isn't being overridden

### Component Styles Not Working

1. Review MUI component documentation
2. Check if property names match MUI API
3. Verify styleOverrides syntax
4. Test with simpler overrides first

### TypeScript Errors

1. Ensure your theme matches the `AbzuThemeConfig` interface
2. Check for typos in property names
3. Verify color string formats
4. Review the types.ts file for the complete schema

## Migration Guide

### From Legacy Theming

If migrating from a previous theming approach:

1. **Extract current values:**
   - Document current colors
   - Note typography settings
   - List component customizations

2. **Create new theme file:**
   - Start with default-theme.json as template
   - Replace colors with your values
   - Add custom properties as needed

3. **Test thoroughly:**
   - Check all pages and components
   - Test light and dark modes
   - Verify responsive behavior

4. **Update environment configs:**
   - Add themeConfig reference
   - Remove old theme references
   - Update documentation

## Contributing

When adding new theme capabilities:

1. Update `types.ts` with new interfaces
2. Extend `converter.ts` with conversion logic
3. Update this README with examples
4. Add to default-theme.json with sensible defaults
5. Test with all example themes

## Resources

- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)
- [Material Design Guidelines](https://material.io/design)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/01/color-theory-for-designers-part-1-the-meaning-of-color/)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## License

This theme system is part of the Abzu Stop Place Registry application and is licensed under EUPL 1.2.
