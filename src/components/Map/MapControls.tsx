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

import { LocationSearching as LocationSearchingIcon } from "@mui/icons-material";
import { Fab, useTheme } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { UserActions } from "../../actions";

export const MapControls: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;

  const handleOpenLookupCoordinates = () => {
    dispatch(UserActions.openLookupCoordinatesDialog());
  };

  return (
    <Fab
      size="small"
      onClick={handleOpenLookupCoordinates}
      aria-label={
        formatMessage({ id: "lookup_coordinates" }) || "Lookup coordinates"
      }
      sx={{
        position: "absolute",
        bottom: 68,
        right: 48,
        zIndex: 1000,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <LocationSearchingIcon />
    </Fab>
  );
};
