import { SxProps, Theme } from "@mui/material";

export const favoriteSectionContainer: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: { xs: "stretch", sm: "center" },
  flexDirection: { xs: "column", sm: "row" },
  gap: { xs: 1, sm: 0 },
  mb: 1,
};

export const favoriteActionsContainer: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  alignItems: "center",
  justifyContent: { xs: "space-between", sm: "flex-end" },
};
