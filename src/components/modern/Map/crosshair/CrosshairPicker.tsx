import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  getCrosshairPreference,
  setCrosshairPreference,
} from "./crosshairPreference";
import type { CrosshairSetting } from "./types";
import { CROSSHAIR_TYPES } from "./types";

const ALL_OPTIONS: CrosshairSetting[] = ["none", ...CROSSHAIR_TYPES];

const PREVIEW_SIZE = 22;
const PREVIEW_C = PREVIEW_SIZE / 2;
const PREVIEW_GAP = 4;
const PREVIEW_CIRCLE_R = 3;
const PREVIEW_DOT_R = 1.5;

interface PreviewSvgProps {
  type: CrosshairSetting;
  color: string;
  errorColor: string;
}

const PreviewSvg: React.FC<PreviewSvgProps> = ({ type, color, errorColor }) => {
  const s = PREVIEW_SIZE;
  const c = PREVIEW_C;
  const g = PREVIEW_GAP;

  if (type === "none") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line
          x1={c}
          y1={2}
          x2={c}
          y2={s - 2}
          stroke={color}
          strokeWidth={0.75}
          strokeDasharray="2,2"
          opacity={0.35}
        />
        <line
          x1={2}
          y1={c}
          x2={s - 2}
          y2={c}
          stroke={color}
          strokeWidth={0.75}
          strokeDasharray="2,2"
          opacity={0.35}
        />
        <line
          x1={4}
          y1={4}
          x2={s - 4}
          y2={s - 4}
          stroke={errorColor}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {type === "classic" && (
        <>
          <line x1={c} y1={0} x2={c} y2={s} stroke={color} strokeWidth={0.75} />
          <line x1={0} y1={c} x2={s} y2={c} stroke={color} strokeWidth={0.75} />
        </>
      )}
      {(type === "dot" || type === "circle" || type === "gap") && (
        <>
          <line
            x1={c}
            y1={0}
            x2={c}
            y2={c - g}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={c}
            y1={c + g}
            x2={c}
            y2={s}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={0}
            y1={c}
            x2={c - g}
            y2={c}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={c + g}
            y1={c}
            x2={s}
            y2={c}
            stroke={color}
            strokeWidth={0.75}
          />
        </>
      )}
      {type === "dot" && (
        <circle cx={c} cy={c} r={PREVIEW_DOT_R} fill={color} />
      )}
      {type === "circle" && (
        <circle
          cx={c}
          cy={c}
          r={PREVIEW_CIRCLE_R}
          fill="none"
          stroke={color}
          strokeWidth={0.75}
        />
      )}
    </svg>
  );
};

export const CrosshairPicker: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [selected, setSelected] = useState<CrosshairSetting>(() =>
    getCrosshairPreference(),
  );

  const handleSelect = (type: CrosshairSetting) => {
    setCrosshairPreference(type);
    setSelected(type);
  };

  return (
    <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          mb: 1,
          display: "block",
        }}
      >
        {formatMessage({ id: "drag_crosshair" })}
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        {ALL_OPTIONS.map((type) => (
          <Box
            key={type}
            onClick={() => handleSelect(type)}
            title={formatMessage({ id: `crosshair_${type}` })}
            sx={{
              width: 38,
              height: 42,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.25,
              borderRadius: 1,
              border: "1.5px solid",
              borderColor: selected === type ? "primary.main" : "divider",
              bgcolor: selected === type ? "action.selected" : "transparent",
              cursor: "pointer",
              transition: "border-color 0.15s, background-color 0.15s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <PreviewSvg
              type={type}
              color={theme.palette.text.primary}
              errorColor={theme.palette.error.main}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.575rem",
                lineHeight: 1,
                color: selected === type ? "primary.main" : "text.secondary",
                fontWeight: selected === type ? 600 : 400,
              }}
            >
              {formatMessage({ id: `crosshair_${type}` })}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
