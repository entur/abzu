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
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useId, useState } from "react";
import { useIntl } from "react-intl";
import {
  getCrosshairPreference,
  setCrosshairPreference,
} from "./crosshairPreference";
import { CrosshairPreview } from "./CrosshairPreview";
import type { CrosshairSetting } from "./types";
import { CROSSHAIR_TYPES } from "./types";

const ALL_OPTIONS: CrosshairSetting[] = ["none", ...CROSSHAIR_TYPES];

const OPTION_WIDTH = 38;
const OPTION_HEIGHT = 42;

/**
 * The drag crosshair style, in the map settings (S-12): one toggle button
 * per style, so it can be reached and chosen with the keyboard and screen
 * readers hear which one is pressed.
 */
export const CrosshairPicker: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const labelId = useId();
  const [selected, setSelected] = useState<CrosshairSetting>(() =>
    getCrosshairPreference(),
  );

  const handleChange = (_event: unknown, type: CrosshairSetting | null) => {
    // An exclusive group reports null when the pressed button is clicked again.
    if (!type) return;
    setCrosshairPreference(type);
    setSelected(type);
  };

  return (
    <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }}>
      <Typography
        id={labelId}
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
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={handleChange}
        size="small"
        aria-labelledby={labelId}
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {ALL_OPTIONS.map((type) => (
          <ToggleButton
            key={type}
            value={type}
            title={formatMessage({ id: `crosshair_${type}` })}
            sx={{
              width: OPTION_WIDTH,
              height: OPTION_HEIGHT,
              p: 0,
              flexDirection: "column",
              gap: 0.25,
              textTransform: "none",
              // Separate buttons, not a joined bar.
              border: "1.5px solid",
              borderRadius: "4px !important",
              borderColor: "divider",
              "&.Mui-selected": { borderColor: "primary.main" },
            }}
          >
            <CrosshairPreview
              type={type}
              color={theme.palette.text.primary}
              errorColor={theme.palette.error.main}
            />
            <Typography
              component="span"
              sx={{
                fontSize: "0.575rem",
                lineHeight: 1,
                color: selected === type ? "primary.main" : "text.secondary",
                fontWeight: selected === type ? 600 : 400,
              }}
            >
              {formatMessage({ id: `crosshair_${type}` })}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
