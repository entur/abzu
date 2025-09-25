# Abzu Modern Theme System

This directory contains the modernized MUI theme system for the Abzu Stop Place Registry application.

## Overview

The theme system has been restructured to provide:

- **Configuration-driven theming** with JSON config files (inspired by Inanna)
- Modern Material-UI theming with TypeScript support
- Responsive design patterns
- Environment-aware styling (dev/test/prod)
- Light/dark mode support (ready for future implementation)
- Build-time theme customization
- Consistent component styling and spacing

## Architecture

```
theme/
├── index.ts                    # Main theme factory and exports
├── base.ts                     # Base theme configuration (legacy)
├── variants/                   # Theme variants (legacy)
│   ├── light.ts                # Light theme variant
│   └── dark.ts                 # Dark theme variant
├── config/                     # Configuration-driven theming
│   ├── types.ts                # TypeScript type definitions
│   ├── loader.ts               # Configuration loading and caching
│   ├── converter.ts            # Config to MUI theme conversion
│   ├── default-theme-config.json      # Default theme configuration
│   ├── theme-variants-config.json     # Light/dark variant overrides
│   ├── custom-theme-example.json      # Example custom theme
│   └── README.md               # Configuration system docs
├── ThemeProvider.tsx           # Theme context provider
├── hooks.ts                    # Theme-related hooks
├── utils.ts                    # Responsive utilities
└── README.md                   # This file
```

## Usage

### Configuration-Driven Theming (Recommended)

The new configuration-driven approach allows for easy theme customization:

```tsx
import { AbzuThemeProvider } from "../theme/ThemeProvider";

// Use default configuration
function App() {
  return (
    <AbzuThemeProvider>
      <YourApp />
    </AbzuThemeProvider>
  );
}

// Use custom configuration
function App() {
  return (
    <AbzuThemeProvider useConfigFiles={true}>
      <YourApp />
    </AbzuThemeProvider>
  );
}
```

### Build-Time Theme Customization

Set environment variables to use custom theme configurations:

```bash
# Use custom theme config
VITE_THEME_CONFIG=./my-custom-theme.json npm run build
```

### Basic Theme Usage

Access theme properties in components:

```tsx
import { useAbzuTheme } from "../theme/hooks";

const MyComponent = () => {
  const { theme, isMobile, spacing } = useAbzuTheme();

  return (
    <div
      sx={{
        padding: spacing.responsive.padding.container,
        color: theme.palette.primary.main,
      }}
    >
      Content
    </div>
  );
};
```

### Responsive Design

Use the responsive utilities for consistent breakpoint handling:

```tsx
import { useResponsive, responsiveValue } from "../theme/utils";

const ResponsiveComponent = () => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <Box
      sx={{
        width: responsiveValue({ xs: "100%", sm: "50%", lg: "25%" }),
        padding: isMobile ? 2 : 4,
      }}
    >
      {isMobile ? "Mobile View" : "Desktop View"}
    </Box>
  );
};
```

### Environment-Aware Styling

The theme automatically adapts based on the environment:

- **Development**: Green header (#457645)
- **Test**: Orange header (#d18e25)
- **Production**: Dark blue header (#181C56)

Environment badges are automatically added to non-production environments.

### Custom Hooks

- `useAbzuTheme()` - Access theme with responsive utilities
- `useEnvironmentStyles()` - Environment-specific styling
- `useSpacing()` - Consistent spacing utilities
- `useElevation()` - Shadow/elevation helpers

## Theme Extensions

The theme extends MUI's default theme with:

- **Custom Colors**:
  - Primary: #5AC39A (Entur Green)
  - Secondary: #181C56 (Entur Dark Blue)
  - Tertiary: #41c0c4 (Accent Blue)

- **Responsive Breakpoints**:
  - xs: 0px (mobile)
  - sm: 600px (small tablet)
  - md: 900px (large tablet)
  - lg: 1200px (desktop)
  - xl: 1536px (large desktop)

- **Typography**: Modern Roboto-based typography scale
- **Component Overrides**: Consistent styling for buttons, cards, menus, etc.
- **Custom Scrollbars**: Modern styled scrollbars

## Migration from Old Theme

The new theme system is backward compatible with the existing theme configuration. The `AbzuThemeProvider` wraps the existing MUI theme structure while providing enhanced features.

### Key Benefits

1. **Better TypeScript Support**: Full type safety for theme properties
2. **Responsive Utilities**: Built-in responsive design helpers
3. **Environment Awareness**: Automatic environment-based styling
4. **Consistent Spacing**: Unified spacing system across the app
5. **Modern Component Styles**: Updated component styling with better shadows and borders
6. **Future-Ready**: Prepared for dark mode and additional theme variants

## Future Enhancements

- Theme switching UI component
- User preference persistence
- Additional theme variants
- Custom theme builder
- Advanced responsive utilities
