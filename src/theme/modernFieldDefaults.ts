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

import {
  createTheme,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";

/**
 * Text fields in an editor hold stop data, not personal details, so the
 * browser's form history ("01", "D32", …) is only in the way (F-14).
 * Fields that want suggestions (e.g. search) set their own autoComplete.
 */
const MODERN_FIELD_DEFAULTS: ThemeOptions = {
  components: {
    MuiTextField: { defaultProps: { autoComplete: "off" } },
  },
};

/** The modern UI's theme plus its field defaults. The classic UI is not affected. */
export const withModernFieldDefaults = (theme: Theme): Theme =>
  createTheme(theme, MODERN_FIELD_DEFAULTS);
