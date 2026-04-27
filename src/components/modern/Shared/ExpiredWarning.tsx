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

import { Warning as WarningIcon } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface ExpiredWarningProps {
  show?: boolean;
}

/**
 * Modern replacement for HasExpiredInfo component
 * Shows a warning chip when a stop place has expired
 */
export const ExpiredWarning: React.FC<ExpiredWarningProps> = ({ show }) => {
  const { formatMessage } = useIntl();

  if (!show) return null;

  return (
    <Tooltip
      title={formatMessage({ id: "stop_has_expired_last_version" })}
      arrow
    >
      <Chip
        icon={<WarningIcon />}
        label={formatMessage({ id: "expired" })}
        color="warning"
        size="small"
        sx={{ mb: 1 }}
      />
    </Tooltip>
  );
};
