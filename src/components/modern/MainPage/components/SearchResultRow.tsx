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

const SECONDARY_TEXT_SIZE = "0.75rem";

const secondaryTextSx = {
  display: "block",
  color: "text.secondary",
  fontSize: SECONDARY_TEXT_SIZE,
} as const;

interface SearchResultRowProps {
  name: string;
  /** Short tag after the name, e.g. "MM" for a multimodal stop. */
  badge?: string;
  id: string;
  locations: string[];
  /** "Expired", "Future" or "Permanently terminated". */
  status?: string | null;
  /** Mode icons or the group icon; kept in view, never squeezed out. */
  icons: React.ReactNode;
}

/**
 * One search result (F-56, F-57): the name, location and id stack in a text
 * column that can shrink (long names get an ellipsis), and the icons sit in a
 * row on the right that always stays visible. Secondary text is 12 px and
 * uses theme colours.
 */
export const SearchResultRow = ({
  name,
  badge,
  id,
  locations,
  status,
  icons,
}: SearchResultRowProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1,
      width: "100%",
      minWidth: 0,
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
        {name}
        {badge && (
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: SECONDARY_TEXT_SIZE, ml: 0.75 }}
          >
            {badge}
          </Typography>
        )}
      </Typography>
      {locations.map((location) => (
        <Typography key={location} noWrap sx={secondaryTextSx}>
          {location}
        </Typography>
      ))}
      <Typography noWrap sx={{ ...secondaryTextSx, fontFamily: "monospace" }}>
        {id}
      </Typography>
      {status && (
        <Typography sx={{ ...secondaryTextSx, color: "warning.dark" }}>
          {status}
        </Typography>
      )}
    </Box>
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        pt: 0.25,
      }}
    >
      {icons}
    </Box>
  </Box>
);
