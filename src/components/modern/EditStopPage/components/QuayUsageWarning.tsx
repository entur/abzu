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
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { getQuaySearchUrl } from "../../../../utils/shamash";
import { useQuayUsageWarning } from "../hooks/useQuayUsageWarning";

const SPINNER_SIZE = 18;

interface QuayUsageWarningProps {
  quayId: string | null;
}

/**
 * Warns that a quay is still referenced by live timetable data before it is
 * removed. Legacy shows this in its own delete dialog; modern renders it inside
 * the shared ConfirmDialog.
 */
export const QuayUsageWarning = ({ quayId }: QuayUsageWarningProps) => {
  const { formatMessage } = useIntl();
  const { isLoading, hasActiveUsage, authorities } =
    useQuayUsageWarning(quayId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CircularProgress size={SPINNER_SIZE} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {formatMessage({ id: "checking_quay_usage" })}
        </Typography>
      </Box>
    );
  }

  if (!hasActiveUsage || !quayId) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>{formatMessage({ id: "quay_usages_found" })}</AlertTitle>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {formatMessage({ id: "important_quay_usages_found" })}
      </Typography>
      {authorities.length > 0 && (
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {authorities.join(", ")}
        </Typography>
      )}
      <Link
        href={getQuaySearchUrl(quayId)}
        target="_blank"
        rel="noopener noreferrer"
        variant="body2"
      >
        {formatMessage({ id: "important_quay_usages_api_link" })}
      </Link>
    </Alert>
  );
};
