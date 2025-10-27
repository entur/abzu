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

import { Box } from "@mui/material";
import React from "react";

interface CountBadgeProps {
  count: number;
  color?: string;
}

/**
 * Modern replacement for CircularNumber component
 * Displays a count in a circular badge using MUI styling
 */
export const CountBadge: React.FC<CountBadgeProps> = ({ count, color }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: color || "primary.main",
        color: "white",
        fontSize: "0.75rem",
        fontWeight: 500,
        px: 0.5,
      }}
    >
      {count}
    </Box>
  );
};
