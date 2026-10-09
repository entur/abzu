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
import Routes from "../../../../routes/";
import CopyIdButton from "../../../Shared/CopyIdButton";

interface SimpleStopPlaceLinkProps {
  id: string;
  style?: React.CSSProperties;
}

// Simple stop place link component with navigation support
// Uses standard <a> href to avoid router context dependency
export const SimpleStopPlaceLink: React.FC<SimpleStopPlaceLinkProps> = ({
  id,
  style,
}) => {
  const basename = import.meta.env.BASE_URL;
  const cleanBasename = basename.endsWith("/")
    ? basename.slice(0, -1)
    : basename;
  const url = `${cleanBasename}/${Routes.STOP_PLACE}/${id}`;

  return (
    <Box sx={{ ...style, display: "inline-flex", alignItems: "center" }}>
      <MuiLink
        href={url}
        variant="caption"
        sx={{
          fontSize: "inherit",
          textDecoration: "underline",
        }}
        title={`Stop Place ID: ${id}`}
      >
        {id}
      </MuiLink>
      <CopyIdButton idToCopy={id} />
    </Box>
  );
};
