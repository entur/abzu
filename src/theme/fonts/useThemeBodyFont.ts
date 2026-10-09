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

import type { Theme } from "@mui/material/styles";
import { useEffect } from "react";

/**
 * Applies the active theme's font family to <body> as an inline style.
 *
 * The legacy stylesheet `styles/main.css` sets `body { font-family: sans-serif }`,
 * and because `StyledEngineProvider injectFirst` places MUI's stylesheet before it,
 * that rule wins over the theme for every element inheriting from <body>. An inline
 * style outranks both, so the theme keeps control without editing shared legacy CSS
 * (legacy renders no CssBaseline and would fall back to the browser default serif).
 */
export const useThemeBodyFont = (theme: Theme | null): void => {
  useEffect(() => {
    if (!theme) return;

    const fontFamily = theme.typography?.fontFamily;
    if (!fontFamily) return;

    const previousFontFamily = document.body.style.fontFamily;
    document.body.style.fontFamily = fontFamily;

    return () => {
      document.body.style.fontFamily = previousFontFamily;
    };
  }, [theme]);
};
