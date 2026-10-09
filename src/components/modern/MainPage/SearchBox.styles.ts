import { SxProps, Theme } from "@mui/material";

export const searchFab = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: 80,
  left: 16,
  zIndex: 1000,
  boxShadow: theme.shadows[6],
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.1)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

export const searchBoxPaper = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: { xs: 70, sm: 70 },
  left: { xs: 8, sm: 8 },
  right: { xs: 8, sm: "auto" },
  width: { xs: "auto", sm: 480 },
  maxWidth: { xs: "calc(100vw - 16px)", sm: 480 },
  zIndex: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 3,
  overflow: "visible",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  transition: "box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.18)",
  },
  "@media (prefers-contrast: more)": {
    border: "2px solid",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

export const searchBoxContent: SxProps<Theme> = {
  p: { xs: 1.5, sm: 2 },
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.5, sm: 2 },
};

export const searchBoxHeader: SxProps<Theme> = {
  position: "relative",
  minHeight: 24,
  mb: 1,
};
