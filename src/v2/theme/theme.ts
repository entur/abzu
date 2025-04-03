import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    header: {
      logo: string;
      logoHeight: number;
      titleFontSize: string;
    };
  }
  interface ThemeOptions {
    header?: {
      logo?: string;
      logoHeight?: number;
      titleFontSize?: string;
    };
  }
}

const theme = createTheme({
  header: {
    logo: "v2/theme/logo.png",
    logoHeight: 20,
    titleFontSize: "1.25rem",
  },
});

export default theme;
