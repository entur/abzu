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

import { Chip, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";

/**
 * Marks a group member whose stop place has expired, e.g. the version a
 * merge leaves behind (F-87). The hint points to the row's remove button.
 */
export const ExpiredMemberChip: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Tooltip title={formatMessage({ id: "group_member_expired_hint" })} arrow>
      <Chip
        label={formatMessage({ id: "has_expired" })}
        color="warning"
        size="small"
        sx={{ flexShrink: 0 }}
      />
    </Tooltip>
  );
};
