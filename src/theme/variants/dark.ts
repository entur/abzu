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

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.6)",
      disabled: "rgba(255, 255, 255, 0.38)",
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          backgroundColor: "#1e1e1e",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1e1e1e",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.23)",
            },
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.4)",
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
        contained: {
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.5)",
          "&:hover": {
            boxShadow:
              "0px 3px 6px rgba(0, 0, 0, 0.4), 0px 3px 6px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2d2d2d",
          boxShadow:
            "0px 5px 5px -3px rgba(0,0,0,0.4), 0px 8px 10px 1px rgba(0,0,0,0.3), 0px 3px 14px 2px rgba(0,0,0,0.2)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(90, 195, 154, 0.16)",
            "&:hover": {
              backgroundColor: "rgba(90, 195, 154, 0.24)",
            },
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
};
