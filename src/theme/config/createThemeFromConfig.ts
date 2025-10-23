/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 https://joinup.ec.europa.eu/software/page/eupl

 Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the Licence for the specific language governing permissions and
 limitations under the Licence. */

import { createTheme, type Theme } from "@mui/material/styles";
import type { AbzuThemeConfig } from "./theme-config";

/**
 * Create MUI Theme from Abzu theme configuration
 * Simply spreads the entire config into MUI's createTheme()
 * No manual conversion needed - MUI handles all standard properties automatically
 */
export function createThemeFromConfig(config: AbzuThemeConfig): Theme {
  // MUI's createTheme() automatically handles:
  // - palette, typography, shape, spacing, breakpoints
  // - components (styleOverrides, defaultProps)
  // - Custom properties (via module augmentation)

  // Just spread everything - it all works!
  return createTheme(config);
}
