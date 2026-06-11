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

import { Chip, useTheme } from "@mui/material";
import React from "react";
import "../../modern.css";
import { environmentBadgeChip } from "../../styles";

interface EnvironmentBadgeProps {
  environment: string;
  badge: {
    content: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    fontWeight: number;
    padding: string;
    borderRadius: string;
    textTransform: "uppercase";
  };
  isMobile: boolean;
}

export const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({
  environment,
  badge,
  isMobile,
}) => {
  const theme = useTheme();

  if (environment === "prod") return null;

  return (
    <Chip
      label={badge.content}
      size={isMobile ? "small" : "medium"}
      sx={environmentBadgeChip(theme, badge, isMobile)}
    />
  );
};
