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

import { ComponentToggle } from "@entur/react-component-toggle";
import { Article, MenuBook, OpenInNew } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { menuItemPrimary } from "../../styles";

const USER_GUIDE_URL =
  "https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry";

const MENU_MIN_WIDTH = 260;
const MENU_MAX_HEIGHT = "calc(100vh - 120px)";
const EXTERNAL_LINK_ICON_SIZE = 16;

interface HelpControlProps {
  extPath?: string;
}

/**
 * Resources for using the tool: the user guide, plus whatever reference links
 * the deployment adds.
 *
 * These are all *reading material that lives outside the application*, which is
 * why they are neither navigation nor settings. The user guide was briefly a
 * navigation tab and the deployment links were briefly under the settings gear;
 * neither fit, because neither is a place in the app or a preference.
 *
 * `AdditionalMenuSection` is rendered exactly as the legacy header renders it —
 * no props, no wrapper styling. How those links look is the deployment's own
 * concern, and the legacy header shows the same component.
 */
export const HelpControl: React.FC<HelpControlProps> = ({ extPath }) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const helpLabel = formatMessage({ id: "help" });
  const userGuideLabel = formatMessage({ id: "user_guide" });

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={helpLabel}>
        <IconButton
          color="inherit"
          aria-label={helpLabel}
          aria-haspopup="true"
          onClick={handleOpen}
          sx={{ p: { xs: 1, sm: 1.5 } }}
        >
          <MenuBook />
        </IconButton>
      </Tooltip>

      <Menu
        id="help-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              /* Deliberately not a fixed width: the deployment's own rows set
                 their width, and a fixed one leaves dead space beside them. */
              minWidth: MENU_MIN_WIDTH,
              maxWidth: "90vw",
              maxHeight: MENU_MAX_HEIGHT,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableAutoFocus
        disableEnforceFocus
      >
        <MenuItem
          component="a"
          href={USER_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={formatMessage(
            { id: "navigation_opens_in_new_tab" },
            { label: userGuideLabel },
          )}
          onClick={handleClose}
          sx={menuItemPrimary(theme)}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
            <Article />
          </ListItemIcon>
          <ListItemText primary={userGuideLabel} />
          <OpenInNew
            sx={{ ml: 1, fontSize: EXTERNAL_LINK_ICON_SIZE, opacity: 0.6 }}
          />
        </MenuItem>

        {extPath && (
          <Box>
            <Divider />
            <ComponentToggle
              feature={`${extPath}/AdditionalMenuSection`}
              renderFallback={() => <></>}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};
