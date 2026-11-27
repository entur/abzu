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

import { createTheme } from "@mui/material/styles";
import { describe, expect, test } from "vitest";
import { withModernFieldDefaults } from "../theme/modernFieldDefaults";

describe("withModernFieldDefaults (F-14)", () => {
  test("turns off browser form history for text fields", () => {
    const theme = withModernFieldDefaults(createTheme());
    expect(theme.components?.MuiTextField?.defaultProps?.autoComplete).toBe(
      "off",
    );
  });

  test("keeps the theme's own field settings and palette", () => {
    const configured = createTheme({
      palette: { primary: { main: "#181c56" } },
      components: {
        MuiTextField: {
          defaultProps: { size: "small" },
          styleOverrides: { root: { margin: 4 } },
        },
      },
    });

    const theme = withModernFieldDefaults(configured);

    expect(theme.palette.primary.main).toBe("#181c56");
    expect(theme.components?.MuiTextField?.defaultProps).toEqual({
      size: "small",
      autoComplete: "off",
    });
    expect(theme.components?.MuiTextField?.styleOverrides).toEqual({
      root: { margin: 4 },
    });
  });
});
