import { SxProps, Theme } from "@mui/material";

export const searchMenuItem: SxProps<Theme> = {
  minWidth: { xs: "auto", sm: 280 },
  maxWidth: { xs: "calc(100vw - 120px)", sm: 460 },
  whiteSpace: "normal",
  py: 1,
  px: 2,
};

export const searchMenuItemNoResults: SxProps<Theme> = {
  minWidth: { xs: "auto", sm: 280 },
  maxWidth: { xs: "calc(100vw - 120px)", sm: 460 },
  whiteSpace: "normal",
  py: 1,
  px: 2,
  color: "text.disabled",
  fontStyle: "italic",
  cursor: "default",
};

export const filterNotificationBox: SxProps<Theme> = {
  py: 1,
  px: 2,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  "&:hover": {
    backgroundColor: "action.hover",
  },
};

export const filterNotificationContent: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minWidth: 0,
  width: "100%",
};

export const filterNotificationTitle: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: "0.9375rem",
};

export const filterNotificationAction: SxProps<Theme> = {
  fontSize: "0.8125rem",
  color: "primary.main",
  cursor: "pointer",
  textDecoration: "underline",
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: "primary.dark",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
};
