import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";

const CompassBearingSelector = ({ bearing, onBearingChange }) => {
  const compassRef = useRef(null);

  const calculateBearing = (event) => {
    if (compassRef.current) {
      const compassRect = compassRef.current.getBoundingClientRect();
      const centerX = compassRect.left + compassRect.width / 2;
      const centerY = compassRect.top + compassRect.height / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate angle from the center
      const angleRad = Math.atan2(mouseY - centerY, mouseX - centerX);
      let angleDeg = (angleRad * (180 / Math.PI) + 90) % 360; // Convert to degrees and rotate to start from top
      if (angleDeg < 0) angleDeg += 360; // Normalize to 0-360

      // Pass new bearing back to parent
      onBearingChange(Math.round(angleDeg));
    }
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      // Left mouse button is held down
      calculateBearing(event);
    }
  };

  const handleMouseClick = (event) => {
    calculateBearing(event);
  };

  return (
    <Box
      ref={compassRef}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      width={200}
      height={200}
      sx={{ userSelect: "none" }} // Disable text selection for the whole compass
    >
      {/* Compass Background */}
      <Box
        sx={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          border: "10px solid #1976d2",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle, #ffffff, #d9e2ef)",
          cursor: "pointer",
          userSelect: "none", // Prevent text selection inside compass
        }}
      >
        {/* Bearing Indicator */}
        <Box
          sx={{
            width: 2,
            height: "45%",
            backgroundColor: "#d32f2f",
            position: "absolute",
            bottom: "50%",
            transform: `rotate(${bearing}deg)`,
            transformOrigin: "center bottom",
            userSelect: "none", // Prevent selection on indicator
          }}
        />

        {/* North, East, South, West Labels */}
        <Typography sx={{ position: "absolute", top: 8, userSelect: "none" }}>
          N
        </Typography>
        <Typography
          sx={{ position: "absolute", bottom: 8, userSelect: "none" }}
        >
          S
        </Typography>
        <Typography sx={{ position: "absolute", right: 8, userSelect: "none" }}>
          E
        </Typography>
        <Typography sx={{ position: "absolute", left: 8, userSelect: "none" }}>
          W
        </Typography>
      </Box>
    </Box>
  );
};

export default CompassBearingSelector;
