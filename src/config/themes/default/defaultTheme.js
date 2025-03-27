/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence.
 */

import { lighten } from "@mui/material/styles";
import { getTiamatEnv } from "../../themeConfig";

export const primary = "#5AC39A";
export const primaryDarker = "#181C56";
export const darkColor = "#181C56";

const cyan700 = "#5AC39A";
const grey100 = "#f5f5f5";
const grey300 = "#e0e0e0";
const grey400 = "#bdbdbd";
const grey500 = "#9e9e9e";
const white = "#ffffff";
const darkBlack = "rgba(0, 0, 0, 0.87)";
const fullBlack = "rgba(0, 0, 0, 1)";

export const getEnvColor = (env) => {
  let currentEnv = env || getTiamatEnv();
  switch (currentEnv.toLowerCase()) {
    case "development":
      return "#457645";
    case "test":
      return "#d18e25";
    case "prod":
      return darkColor;
    default:
      return darkColor;
  }
};

/*
  In MUI v6 the theme structure follows a standard format.
  - Typography options (such as fontFamily) now go under the `typography` key.
  - The primary color is assigned to `palette.primary.main` and so on.
  - Values not directly used by MUI can be kept in a custom key (here: `custom`).
*/
export const getTheme = () => ({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  palette: {
    primary: {
      main: primary,
    },

    secondary: {
      main: primaryDarker,
    },
    text: {
      primary: darkBlack,
      secondary: grey400,
    },
    background: {
      default: white,
    },
    action: {
      active: darkBlack,
    },
  },
  // Custom keys for values that do not have a default place in the MUI theme.
  custom: {
    // The extra palette colors
    primary2Color: { main: cyan700 },
    primary3Color: { main: grey400 },
    accent1Color: { main: primary },
    accent2Color: { main: grey100 },
    accent3Color: { main: grey500 },
    borderColor: { main: grey300 },
    disabledColor: { main: lighten(darkBlack, 0.3) },
    pickerHeaderColor: { main: primary },
    clockCircleColor: { main: lighten(darkBlack, 0.07) },
    shadowColor: { main: fullBlack },
    alternateTextColor: { main: white },
    // Other component-specific customizations
    datePicker: {
      selectColor: primary,
      selectTextColor: white,
    },
    checkbox: {
      checkedColor: primaryDarker,
    },
    appBar: {
      color: darkColor,
    },
  },
});
