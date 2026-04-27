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

import { Alert, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface StopPlaceInfoProps {
  stopPlaceName: string;
  stopPlaceId?: string;
  hasExpired?: boolean;
}

/**
 * Display stop place information and expired alert
 */
export const StopPlaceInfo: React.FC<StopPlaceInfoProps> = ({
  stopPlaceName,
  stopPlaceId,
  hasExpired,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
        {`${stopPlaceName} (${stopPlaceId})`}
      </Typography>

      {hasExpired && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formatMessage({ id: "expired_can_only_be_deleted" })}
        </Alert>
      )}
    </>
  );
};
