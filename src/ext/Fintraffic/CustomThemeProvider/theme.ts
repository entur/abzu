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

import { lighten } from "@mui/material/styles/";
import { fontFace, fontName } from "./font";

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

export const getTheme = (): any => ({
  fontFamily: fontName,
  typography: {
    fontFamily: fontName,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: fontFace,
    },
  },
  palette: {
    primary1Color: {
      main: primary,
    },
    primary2Color: {
      main: cyan700,
    },
    primary3Color: {
      main: grey400,
    },
    accent1Color: {
      main: primary,
    },
    accent2Color: {
      main: grey100,
    },
    accent3Color: {
      main: grey500,
    },
    textColor: {
      main: darkBlack,
    },
    alternateTextColor: {
      main: white,
    },
    canvasColor: {
      main: white,
    },
    borderColor: {
      main: grey300,
    },
    disabledColor: {
      main: lighten(darkBlack, 0.3),
    },
    pickerHeaderColor: {
      main: primary,
    },
    clockCircleColor: {
      main: lighten(darkBlack, 0.07),
    },
    shadowColor: {
      main: fullBlack,
    },
  },
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
});
