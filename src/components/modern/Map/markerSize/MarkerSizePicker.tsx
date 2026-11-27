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
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useId } from "react";
import { useIntl } from "react-intl";
import { MARKER_SIZE_CHOICES, MarkerSize } from "./markerSizePreference";
import { useMarkerSize } from "./useMarkerSize";

/** Small / Medium / Large for every map marker, in the map settings. */
export const MarkerSizePicker: React.FC = () => {
  const { formatMessage } = useIntl();
  const { markerSize, setMarkerSize } = useMarkerSize();
  const labelId = useId();

  const handleChange = (_event: unknown, size: MarkerSize | null) => {
    // An exclusive group reports null when the pressed button is clicked again.
    if (size) setMarkerSize(size);
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
        {formatMessage({ id: "marker_size" })}
      </Typography>
      <ToggleButtonGroup
        value={markerSize}
        exclusive
        onChange={handleChange}
        size="small"
        fullWidth
        aria-labelledby={labelId}
      >
        {MARKER_SIZE_CHOICES.map((size) => (
          <ToggleButton key={size} value={size} sx={{ textTransform: "none" }}>
            {formatMessage({ id: `marker_size_${size}` })}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
