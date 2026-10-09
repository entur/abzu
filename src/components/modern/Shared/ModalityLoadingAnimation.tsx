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

import { Box, keyframes, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalityIconImg from "../../MainPage/ModalityIconImg";

interface ModalityLoadingAnimationProps {
  message?: string;
}

/**
 * Fun loading animation that cycles through different transport mode icons
 * Creates a playful, transport-themed loading experience
 */
export const ModalityLoadingAnimation: React.FC<
  ModalityLoadingAnimationProps
> = ({ message = "Loading..." }) => {
  const theme = useTheme();

  // Array of transport modes to cycle through (matching iconUtils.ts types)
  const modalities = [
    { type: "onstreetBus", submode: null },
    { type: "onstreetTram", submode: null },
    { type: "railStation", submode: null },
    { type: "metroStation", submode: null },
    { type: "ferryStop", submode: null },
    { type: "airport", submode: null },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % modalities.length);
    }, 600); // Change icon every 600ms

    return () => clearInterval(interval);
  }, [modalities.length]);

  // Keyframe animations
  const fadeInOut = keyframes`
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    50% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(0.8) translateY(-10px);
    }
  `;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        gap: 2,
      }}
    >
      {/* Icon container with animation */}
      <Box
        sx={{
          position: "relative",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated icon with theme color */}
        <Box
          key={currentIndex}
          sx={{
            animation: `${fadeInOut} 600ms ease-in-out`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& span": {
              display: "inline-block",
              position: "relative",
            },
            "& img": {
              // Convert black icon to theme color: brightness(0) makes it black, then invert to white
              // Then use drop-shadow with large blur to create colored version
              filter: (theme) =>
                `brightness(0) invert(1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
            },
          }}
        >
          <ModalityIconImg
            type={modalities[currentIndex].type}
            submode={modalities[currentIndex].submode}
            svgStyle={{
              transform: "scale(2.5)",
              filter: `drop-shadow(0 0 2px ${theme.palette.primary.main})`,
            }}
            iconStyle={{}}
          />
        </Box>
      </Box>

      {/* Loading message */}
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
