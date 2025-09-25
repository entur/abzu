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

import { LoginOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Tooltip } from "@mui/material";
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
  isMobile,
}) => {
  const { formatMessage } = useIntl();
  const logIn = formatMessage({ id: "log_in" });

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mr: { xs: 1, sm: 2 } }}>
        <Button
          variant="contained"
          onClick={onLogin}
          startIcon={!isMobile ? <LoginOutlined /> : undefined}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            },
          }}
        >
          {isMobile ? logIn.split(" ")[0] : logIn}
        </Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.875rem",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {preferredName ? preferredName.charAt(0).toUpperCase() : "U"}
        </Avatar>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Tooltip title={`Logged in as ${preferredName || "User"}`}>
        <Chip
          avatar={
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {preferredName ? preferredName.charAt(0).toUpperCase() : "U"}
            </Avatar>
          }
          label={preferredName || "User"}
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "& .MuiChip-avatar": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};
