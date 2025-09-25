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

import { ThemeOptions } from "@mui/material/styles";

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
        contained: {
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)",
          "&:hover": {
            boxShadow:
              "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(90, 195, 154, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(90, 195, 154, 0.12)",
            },
          },
        },
      },
    },
  },
};
