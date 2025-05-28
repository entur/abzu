import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { getTheme } from "./theme";

const muiTheme = createTheme(getTheme());
console.log("\n\n theme!", muiTheme);

export const FintrafficThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};
