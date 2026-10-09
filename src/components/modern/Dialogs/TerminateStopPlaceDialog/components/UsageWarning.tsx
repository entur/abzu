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

import { Alert, Box, CircularProgress, Link, Typography } from "@mui/material";
import { Moment } from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { getStopPlaceSearchUrl } from "../../../../../utils/shamash";
import { WarningInfo } from "../hooks/useTerminateDialog";

interface UsageWarningProps {
  warningInfo?: WarningInfo | string;
  stopPlaceId?: string;
  date: Moment;
}

/**
 * Display usage warnings for the stop place
 * Shows loading, error, or warning states
 */
export const UsageWarning: React.FC<UsageWarningProps> = ({
  warningInfo,
  stopPlaceId,
  date,
}) => {
  const { formatMessage } = useIntl();

  if (typeof warningInfo === "string" || !warningInfo) {
    return null;
  }

  const {
    stopPlaceId: warningStopPlaceId,
    warning,
    loading,
    error,
    activeDatesSize,
    latestActiveDate,
    authorities,
  } = warningInfo;

  if (loading) {
    return (
      <Alert
        severity="info"
        icon={<CircularProgress size={20} />}
        sx={{ mb: 2 }}
      >
        {formatMessage({ id: "checking_stop_place_usage" })}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {formatMessage({ id: "failed_checking_stop_place_usage" })}
      </Alert>
    );
  }

  if (warning && warningStopPlaceId === stopPlaceId && stopPlaceId) {
    const makeSomeNoise =
      activeDatesSize && latestActiveDate && latestActiveDate > date;
    const severity = makeSomeNoise ? "error" : "warning";

    const shamashUrl = getStopPlaceSearchUrl(stopPlaceId);

    return (
      <Alert severity={severity} sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {formatMessage({ id: "stop_place_usages_found" })}
        </Typography>
        {makeSomeNoise && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {formatMessage({ id: "important_stop_place_usages_found" })}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic", mb: 0.5 }}>
              {authorities && authorities.join(", ")}
            </Typography>
            <Link href={shamashUrl} target="_blank" rel="noopener noreferrer">
              {formatMessage({
                id: "important_stop_places_usages_api_link",
              })}
            </Link>
          </Box>
        )}
      </Alert>
    );
  }

  return null;
};
