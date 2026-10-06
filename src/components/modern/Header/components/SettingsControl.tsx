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

import { Settings } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";
import { ConfigContext } from "../../../../config/ConfigContext";
import { useTheme as useAbzuTheme } from "../../../../theme/ThemeProvider";
import { SettingsMenuSection } from "./SettingsMenuSection";
import { UICustomizationSection } from "./UICustomizationSection";

const SETTINGS_SECTION = "settings";
const APPEARANCE_SECTION = "appearance";

const MENU_WIDTH_MOBILE = 320;
const MENU_WIDTH_DESKTOP = 350;
const MENU_MAX_HEIGHT = "calc(100vh - 120px)";

interface SettingsControlProps {
  isMobile: boolean;
}

/**
 * Everything that is a preference rather than a destination.
 *
 * Only preferences. Navigation moved to the navigation line, language to its
 * own control, and the deployment's reference links to the help control — those
 * are reading material, not settings, and sitting behind a gear made them hard
 * to find.
 */
export const SettingsControl: React.FC<SettingsControlProps> = ({
  isMobile,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const { availableThemes } = useAbzuTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const showUICustomization =
    availableThemes.length >= 2 || config.uiMode === "dual";

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenSection(null);
  };

  const handleSectionToggle = (section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return (
    <>
      <Tooltip title={formatMessage({ id: "settings" })}>
        <IconButton
          color="inherit"
          aria-label={formatMessage({ id: "settings" })}
          aria-haspopup="true"
          onClick={handleOpen}
          sx={{ p: { xs: 1, sm: 1.5 } }}
        >
          <Settings />
        </IconButton>
      </Tooltip>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: isMobile ? MENU_WIDTH_MOBILE : MENU_WIDTH_DESKTOP,
              maxWidth: "90vw",
              maxHeight: MENU_MAX_HEIGHT,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Box sx={{ overflow: "auto", flex: 1, py: 1 }}>
          <SettingsMenuSection
            onClose={handleClose}
            isMobile={isMobile}
            isOpen={openSection === SETTINGS_SECTION}
            onToggle={() => handleSectionToggle(SETTINGS_SECTION)}
          />

          {showUICustomization && (
            <>
              <Divider />
              <UICustomizationSection
                onClose={handleClose}
                isMobile={isMobile}
                isOpen={openSection === APPEARANCE_SECTION}
                onToggle={() => handleSectionToggle(APPEARANCE_SECTION)}
              />
            </>
          )}
        </Box>
      </Menu>
    </>
  );
};
