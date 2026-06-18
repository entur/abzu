import { SxProps, Theme } from "@mui/material";

export const searchInputContainer: SxProps<Theme> = {
  position: "relative",
};

export const searchLoadingText: SxProps<Theme> = {
  py: 1,
  px: 2,
  display: "flex",
  alignItems: "center",
  gap: 1,
  fontWeight: 600,
  fontSize: "0.8125rem",
};
