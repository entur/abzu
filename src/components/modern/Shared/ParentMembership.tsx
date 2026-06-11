/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { LoadingDialog } from "./LoadingDialog";
import { useNavigateToStopPlace } from "./useNavigateToStopPlace";

interface ParentMembershipProps {
  parentStop: { id: string; name: string };
}

/**
 * Shows the parent stop place as a clickable chip — mirrors GroupMembership style
 * but uses in-app navigation (with loading feedback) instead of a plain link.
 */
export const ParentMembership: React.FC<ParentMembershipProps> = ({
  parentStop,
}) => {
  const { formatMessage } = useIntl();
  const { loading, loadingName, navigateTo } = useNavigateToStopPlace();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <LoadingDialog
        open={loading}
        message={
          loadingName
            ? `${formatMessage({ id: "loading" })} ${loadingName}`
            : formatMessage({ id: "loading" })
        }
      />
      <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
        {formatMessage({ id: "parent_stop_place" })}:
      </Typography>
      <Chip
        icon={<AccountTreeIcon />}
        label={parentStop.name}
        size="small"
        clickable
        color="primary"
        variant="outlined"
        onClick={() => navigateTo(parentStop.id, parentStop.name)}
      />
    </Box>
  );
};
