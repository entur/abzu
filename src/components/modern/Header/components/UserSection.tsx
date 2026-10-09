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

import { Logout } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface UserSectionProps {
  isAuthenticated: boolean;
  preferredName?: string;
  onLogin: () => void;
  onLogout: () => void;
  isMobile: boolean;
}

export const UserSection: React.FC<UserSectionProps> = ({
  isAuthenticated,
  preferredName,
  onLogin,
  onLogout,
  isMobile,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const logIn = formatMessage({ id: "log_in" });
  const logOut = formatMessage({ id: "log_out" });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mr: { xs: 1, sm: 2 } }}>
        <Button
          variant="contained"
          onClick={onLogin}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: theme.palette.common.white,
            backgroundColor: alpha(theme.palette.common.white, 0.1),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            textTransform: "none",
            fontWeight: theme.typography.fontWeightMedium,
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.2),
            },
            "&:active": {
              backgroundColor: alpha(theme.palette.common.white, 0.3),
            },
          }}
        >
          {logIn}
        </Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Tooltip title={formatMessage({ id: "click_to_logout" })}>
            <Avatar
              onClick={handleClick}
              sx={{
                width: 32,
                height: 32,
                fontSize: theme.typography.body2.fontSize,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                color: theme.palette.common.white,
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                fontWeight: theme.typography.fontWeightMedium,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
              }}
            >
              {preferredName ? preferredName.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                minWidth: 180,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>{logOut}</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
        <Tooltip title={formatMessage({ id: "click_to_logout" })}>
          <Chip
            avatar={
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: theme.typography.fontWeightMedium,
                }}
              >
                {preferredName ? preferredName.charAt(0).toUpperCase() : "U"}
              </Avatar>
            }
            label={preferredName || "User"}
            variant="outlined"
            onClick={handleClick}
            sx={{
              color: theme.palette.common.white,
              borderColor: alpha(theme.palette.common.white, 0.3),
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              fontWeight: theme.typography.fontWeightRegular,
              cursor: "pointer",
              "& .MuiChip-avatar": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                color: theme.palette.common.white,
              },
              "& .MuiChip-label": {
                fontWeight: theme.typography.fontWeightMedium,
                fontSize: theme.typography.body2.fontSize,
              },
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                borderColor: alpha(theme.palette.common.white, 0.4),
              },
              "&:active": {
                backgroundColor: alpha(theme.palette.common.white, 0.3),
              },
            }}
          />
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>{logOut}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
