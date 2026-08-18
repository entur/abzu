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

import { Box, Chip, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";
import { ElementChangeStatus, isPendingStatus } from "./types";

const DOT_SIZE = 7;

interface ElementStatusDotProps {
  status: ElementChangeStatus;
  /** When false, only staged deletions are marked. */
  enabled: boolean;
}

/**
 * The dirty dot on a **list row**, for quays and parking alike.
 *
 * `new` and `modified` render the same dot — the point is "something here is
 * unsaved", exactly as an editor marks a dirty file. Only the tooltip
 * distinguishes them, so the list stays quiet at a glance.
 *
 * Ghost rows get a chip instead, and always render: a struck-through row needs
 * to say why, and hiding a pending deletion would be worse than showing it.
 */
export const ElementStatusDot = ({
  status,
  enabled,
}: ElementStatusDotProps) => {
  const { formatMessage } = useIntl();

  if (status === "deleted") {
    return (
      <Chip
        label={formatMessage({ id: "element_status_deleted" })}
        size="small"
        color="error"
        variant="outlined"
        sx={{ mr: 1, height: 20, fontSize: "0.7rem" }}
      />
    );
  }

  if (!enabled || !isPendingStatus(status)) return null;

  const tooltipId =
    status === "new"
      ? "element_status_new_tooltip"
      : "element_status_modified_tooltip";

  return (
    <Tooltip title={formatMessage({ id: tooltipId })}>
      <Box
        component="span"
        sx={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          bgcolor: "warning.main",
          flexShrink: 0,
          mr: 1,
        }}
      />
    </Tooltip>
  );
};
