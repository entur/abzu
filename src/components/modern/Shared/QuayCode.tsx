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

import { Chip } from "@mui/material";
import React from "react";

interface QuayCodeProps {
  type: "publicCode" | "privateCode";
  value?: string | number | null;
  defaultValue: string | number;
}

/**
 * Modern replacement for Code component
 * Displays public/private codes as styled chips
 */
export const QuayCode: React.FC<QuayCodeProps> = ({
  type,
  value,
  defaultValue,
}) => {
  const isSet = value !== undefined && value !== null && value !== "";

  const colorMap = {
    publicCode: "success.main",
    privateCode: "info.main",
  };

  return (
    <Chip
      label={isSet ? value : defaultValue}
      size="small"
      sx={{
        ml: 0.5,
        height: 20,
        fontSize: isSet ? "0.75rem" : "0.65rem",
        backgroundColor: colorMap[type],
        color: "white",
        fontWeight: isSet ? 600 : 400,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};
