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

import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface TourPanelHeaderProps {
  title: string;
  progress: string;
  onMinimise: () => void;
  onEnd: () => void;
}

export const TourPanelHeader = ({
  title,
  progress,
  onMinimise,
  onEnd,
}: TourPanelHeaderProps) => {
  const { formatMessage } = useIntl();
  const minimise = formatMessage({ id: "guided_tour_minimise" });
  const end = formatMessage({ id: "guided_tour_end" });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {progress}
        </Typography>
      </Box>
      <Tooltip title={minimise}>
        <IconButton size="small" aria-label={minimise} onClick={onMinimise}>
          <MinimizeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={end}>
        <IconButton size="small" aria-label={end} onClick={onEnd}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
