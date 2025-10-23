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

import { ComponentToggle } from "@entur/react-component-toggle";
import { Box, IconButton } from "@mui/material";
import React from "react";
import "../../modern.css";
import { appLogoButton, appLogoImage } from "../../styles";

interface AppLogoProps {
  logo: string;
  logoHeight?: {
    xs?: number;
    sm?: number;
    md?: number;
  };
  config: {
    extPath?: string;
  };
  onClick: () => void;
  isMobile: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  logo,
  logoHeight,
  config,
  onClick,
  isMobile,
}) => {
  return (
    <IconButton
      size={isMobile ? "medium" : "large"}
      edge="start"
      color="inherit"
      aria-label="home"
      onClick={onClick}
      sx={appLogoButton}
    >
      <ComponentToggle
        feature={`${config.extPath}/CustomLogo`}
        renderFallback={() => (
          <Box
            component="img"
            src={logo}
            alt="Abzu Logo"
            sx={appLogoImage(logoHeight)}
          />
        )}
      />
    </IconButton>
  );
};
