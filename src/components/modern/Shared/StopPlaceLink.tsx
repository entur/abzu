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

import { Box, Link as MuiLink } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Routes from "../../../routes/";
import { CopyIdButton } from "./CopyIdButton";

interface StopPlaceLinkProps {
  id: string;
  style?: React.CSSProperties;
}

/**
 * Modern TypeScript stop place link component
 * Displays a clickable link to a stop place with copy ID functionality
 * Uses React Router for navigation
 */
export const StopPlaceLink: React.FC<StopPlaceLinkProps> = ({ id, style }) => {
  const url = `/${Routes.STOP_PLACE}/${id}`;

  return (
    <Box sx={{ ...style, display: "inline-flex", alignItems: "center" }}>
      <MuiLink
        component={Link}
        to={url}
        variant="caption"
        sx={{
          fontSize: "inherit",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {id}
      </MuiLink>
      <CopyIdButton idToCopy={id} />
    </Box>
  );
};
