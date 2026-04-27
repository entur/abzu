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

import { Box, Menu, MenuItem } from "@mui/material";
import React from "react";
import { MinimizedBarMenuProps } from "./types";

/**
 * Overflow menu for mobile view
 * Shows actions that don't fit in the minimized bar
 */
export const MinimizedBarMenu: React.FC<MinimizedBarMenuProps> = ({
  actions,
  anchorEl,
  open,
  onClose,
}) => {
  const handleMenuAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {actions.map((action) => (
        <MenuItem
          key={action.id}
          onClick={() => handleMenuAction(action.onClick)}
          disabled={action.disabled}
        >
          <Box
            sx={{
              mr: 1,
              display: "flex",
              alignItems: "center",
              fontSize: "1.25rem",
              ...(action.color === "error" && { color: "error.main" }),
            }}
          >
            {action.icon}
          </Box>
          {action.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
