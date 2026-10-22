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

import HistoryIcon from "@mui/icons-material/History";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { getStopPlaceWithAll } from "../../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../../store/hooks";
import { useIsViewingOlderVersion } from "./hooks/useIsViewingOlderVersion";

interface StopStatusBannerProps {
  stopPlace: { id?: string | null; hasExpired?: boolean };
}

const bannerSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.5,
  py: 0.5,
} as const;

/**
 * Header banner for a stop that isn't the live, active version: either an
 * older version picked from the history (with a way back), or an expired
 * stop. An older version is never reported as expired (F-42).
 */
export const StopStatusBanner = ({ stopPlace }: StopStatusBannerProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const isViewingOlderVersion = useIsViewingOlderVersion();

  if (isViewingOlderVersion) {
    return (
      <Box
        sx={{ ...bannerSx, bgcolor: "info.main", color: "info.contrastText" }}
      >
        <HistoryIcon sx={{ fontSize: "1rem", color: "inherit" }} />
        <Typography
          variant="caption"
          color="inherit"
          sx={{ fontWeight: 500, flex: 1 }}
        >
          {formatMessage({ id: "viewing_older_version" })}
        </Typography>
        {stopPlace.id && (
          <Button
            size="small"
            color="inherit"
            onClick={() => dispatch(getStopPlaceWithAll(stopPlace.id!))}
          >
            {formatMessage({ id: "go_to_current_version" })}
          </Button>
        )}
      </Box>
    );
  }

  if (!stopPlace.hasExpired) return null;

  return (
    <Box
      sx={{
        ...bannerSx,
        bgcolor: "warning.main",
        color: "warning.contrastText",
      }}
    >
      <WarningAmberIcon sx={{ fontSize: "1rem", color: "inherit" }} />
      <Typography variant="caption" color="inherit" sx={{ fontWeight: 500 }}>
        {formatMessage({ id: "stop_has_expired_last_version" })}
      </Typography>
    </Box>
  );
};
