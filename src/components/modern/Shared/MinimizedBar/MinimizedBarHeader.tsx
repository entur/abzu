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

import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { FavoriteButton } from "../FavoriteButton";
import { MinimizedBarHeaderProps } from "./types";

/**
 * Header section of the minimized bar
 * Displays icon, name, and favorite button
 */
export const MinimizedBarHeader: React.FC<MinimizedBarHeaderProps> = ({
  icon,
  name,
  id,
  entityType,
  hasId,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "100%" }}
    >
      {/* Entity Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: theme.palette.text.secondary,
          flexShrink: 0,
          fontSize: "1.25rem", // small icon size
        }}
      >
        {icon}
      </Box>

      {/* Name */}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: 600,
          color: theme.palette.text.primary,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </Typography>

      {/* Favorite Button */}
      {hasId && id && entityType && (
        <FavoriteButton id={id} name={name || ""} entityType={entityType} />
      )}
    </Box>
  );
};
