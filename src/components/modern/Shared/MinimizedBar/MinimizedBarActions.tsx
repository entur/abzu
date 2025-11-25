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

import { IconButton, Tooltip, useTheme } from "@mui/material";
import React from "react";
import { MinimizedBarActionsProps } from "./types";

/**
 * Action buttons section of the minimized bar
 * Displays all action buttons on desktop
 */
export const MinimizedBarActions: React.FC<MinimizedBarActionsProps> = ({
  actions,
  isSmallScreen,
}) => {
  const theme = useTheme();

  // On small screens, actions are shown in the menu instead
  if (isSmallScreen) {
    return null;
  }

  // Filter actions that should be shown on desktop
  const desktopActions = actions.filter(
    (action) => action.showOnDesktop !== false,
  );

  const getButtonColor = (color?: string, disabled?: boolean) => {
    if (disabled) {
      return theme.palette.action.disabled;
    }
    switch (color) {
      case "primary":
        return theme.palette.primary.main;
      case "error":
        return theme.palette.error.main;
      case "secondary":
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <>
      {desktopActions.map((action) => (
        <Tooltip key={action.id} title={action.tooltip || action.label} arrow>
          <span>
            <IconButton
              size="small"
              onClick={action.onClick}
              disabled={action.disabled}
              sx={{
                color: getButtonColor(action.color, action.disabled),
                "&:hover": { bgcolor: theme.palette.action.hover },
                fontSize: "1.25rem",
              }}
            >
              {action.icon}
            </IconButton>
          </span>
        </Tooltip>
      ))}
    </>
  );
};
