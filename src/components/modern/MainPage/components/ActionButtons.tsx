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

import MdMore from "@mui/icons-material/ExpandMore";
import MdLocationSearching from "@mui/icons-material/LocationSearching";
import { Button, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import NewStopPlace from "../../../MainPage/CreateNewStop";
import { ActionButtonsProps } from "../types";

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isCreatingNewStop,
  newStopIsMultiModal,
  onOpenLookupCoordinates,
  onNewStop,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [showNewStopCreation, setShowNewStopCreation] = useState(false);

  const handleOpenNewStopMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseNewStopMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleNewStop = (isMultiModal: boolean) => {
    onNewStop(isMultiModal);
    handleCloseNewStopMenu();
    setShowNewStopCreation(true);
  };

  const newStopText = {
    headerText: formatMessage({
      id: newStopIsMultiModal
        ? "making_parent_stop_place_title"
        : "making_stop_place_title",
    }),
    bodyText: formatMessage({ id: "making_stop_place_hint" }),
  };

  if (isCreatingNewStop || showNewStopCreation) {
    return (
      <NewStopPlace
        text={newStopText}
        onClose={() => {
          setShowNewStopCreation(false);
        }}
      />
    );
  }

  return (
    <div className={`action-buttons ${isMobile ? "mobile" : ""}`}>
      <Button
        onClick={onOpenLookupCoordinates}
        variant="outlined"
        startIcon={<MdLocationSearching />}
        className="action-button-secondary"
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        {formatMessage({ id: "lookup_coordinates" })}
      </Button>

      <Button
        variant="contained"
        onClick={handleOpenNewStopMenu}
        endIcon={<MdMore />}
        className="action-button-primary"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: theme.shadows[2],
          "&:hover": {
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        {formatMessage({ id: "new_stop" })}
      </Button>

      <Menu
        open={Boolean(menuAnchorEl)}
        anchorEl={menuAnchorEl}
        onClose={handleCloseNewStopMenu}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              border: `1px solid ${theme.palette.divider}`,
              mt: 1,
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleNewStop(false)}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {formatMessage({ id: "new_stop" })}
        </MenuItem>
        <MenuItem
          onClick={() => handleNewStop(true)}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {formatMessage({ id: "new__multi_stop" })}
        </MenuItem>
      </Menu>
    </div>
  );
};
