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

import { Box, Typography } from "@mui/material";
import React from "react";
import CopyIdButton from "../../../Shared/CopyIdButton";

interface SimpleStopPlaceLinkProps {
  id: string;
  style?: React.CSSProperties;
}

// Simple stop place link component that doesn't depend on router context
export const SimpleStopPlaceLink: React.FC<SimpleStopPlaceLinkProps> = ({
  id,
  style,
}) => {
  return (
    <Box sx={{ ...style, display: "inline-flex", alignItems: "center" }}>
      <Typography
        variant="caption"
        sx={{
          color: "primary.main",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "inherit",
        }}
        title={`Stop Place ID: ${id}`}
      >
        {id}
      </Typography>
      <CopyIdButton idToCopy={id} />
    </Box>
  );
};
