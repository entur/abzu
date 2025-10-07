# Theme Components

UI components for the Abzu theme system.

## ThemeSwitcher

A dropdown menu component that allows users to switch between different theme configurations and toggle light/dark mode.

### Features

- Switch between available theme configs (Default, Entur, Custom, etc.)
- Toggle between light and dark mode
- Shows current theme name
- Displays loading state during theme switch
- Persists theme selection in localStorage
- Material-UI styled component

### Usage

#### Basic Usage

```tsx
import { ThemeSwitcher } from "../theme/components/ThemeSwitcher";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}
```

#### With Custom Styling

```tsx
import { ThemeSwitcher } from "../theme/components/ThemeSwitcher";
import { Box } from "@mui/material";

function SettingsPanel() {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
      <ThemeSwitcher />
    </Box>
  );
}
```

### Props

| Prop        | Type                 | Default  | Description                                   |
| ----------- | -------------------- | -------- | --------------------------------------------- |
| `showLabel` | `boolean`            | `false`  | Whether to show a text label next to the icon |
| `variant`   | `'icon' \| 'button'` | `'icon'` | Display variant (future enhancement)          |

### Component Structure

The ThemeSwitcher renders:

1. **Icon Button** - Palette icon that opens the menu
2. **Theme Menu** - Dropdown containing:
   - Current theme name (header)
   - List of available themes with checkmarks
   - Light/Dark mode toggle at the bottom

### Keyboard Navigation

The component supports full keyboard navigation:

- `Tab` - Navigate between menu items
- `Enter/Space` - Select theme
- `Escape` - Close menu

### Accessibility

- ARIA labels for screen readers
- Keyboard accessible
- Focus management
- Proper semantic HTML

### Example Integration in Header

```tsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeSwitcher } from "../theme/components/ThemeSwitcher";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Abzu Stop Place Registry
        </Typography>

        {/* User actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <ThemeSwitcher />
          {/* Other header actions */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
```

### Custom Theme List

To customize which themes appear in the switcher, edit `src/theme/config/loader.ts`:

```typescript
export const getAvailableThemes = (): AvailableTheme[] => {
  return [
    {
      id: "default",
      name: "Default Theme",
      description: "Neutral Material Design theme",
      path: "src/theme/config/default-theme.json",
    },
    {
      id: "company",
      name: "Company Theme",
      description: "Our company's branded theme",
      path: "src/theme/config/company-theme.json",
    },
  ];
};
```

### Loading State

The component automatically shows a loading indicator (CircularProgress) when switching themes to provide user feedback during the theme load operation.

### Error Handling

If a theme fails to load, the component:

1. Logs the error to console
2. Maintains the current theme
3. Closes the menu
4. User can try again

### Browser Support

Works in all modern browsers that support:

- ES6+
- CSS Grid/Flexbox
- localStorage API
