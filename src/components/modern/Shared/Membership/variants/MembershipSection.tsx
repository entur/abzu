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

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccountTree as ParentIcon,
  GroupWork as GroupIcon,
  Hub as RelationsIcon,
} from "@mui/icons-material";
import { Box, Chip, Collapse, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "stack" — memberships as a full section in the same place, and with
 * the same markup, as Quays, Parking, Children and Adjacent sites: divider,
 * `background.default` header with icon + title + count chip + expand toggle,
 * then navigable rows.
 *
 * The other six variants all render inline near the top of the General section,
 * which is what makes memberships read as a special case. This one drops them
 * into the section stack so a parent or group is just another related-things
 * list, positioned and styled exactly like its siblings.
 *
 * Rendered by StopPlaceView rather than StopPlaceGeneralSection — see the
 * `placement` prop on StopPlaceMembership.
 */
export const MembershipSection: React.FC<MembershipProps> = ({
  parentStop,
  groups,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();
  const [expanded, setExpanded] = useState(false);

  const rows = [
    ...(parentStop
      ? [
          {
            id: parentStop.id,
            name: parentStop.name,
            type: formatMessage({ id: "parent_stop_place" }),
            icon: <ParentIcon fontSize="small" color="action" />,
            onClick: () => nav.goToParent(parentStop.id, parentStop.name),
          },
        ]
      : []),
    ...(groups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      type: formatMessage({ id: "group_of_stop_places" }),
      icon: <GroupIcon fontSize="small" color="action" />,
      onClick: () => nav.goToGroup(group.id, group.name),
    })),
  ];

  return (
    <Box>
      <MembershipLoading nav={nav} />
      <Divider />
      <Box
        onClick={() => setExpanded((value) => !value)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.default",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <RelationsIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "memberships_relations" })}
        </Typography>
        <Chip label={rows.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
      </Box>

      <Collapse in={expanded}>
        <Divider />
        {rows.map((row) => (
          <Box
            key={row.id}
            onClick={row.onClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              cursor: "pointer",
              borderBottom: "1px solid",
              borderColor: "divider",
              borderLeft: "3px solid",
              borderLeftColor: "transparent",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {row.icon}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {row.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block" }}
              >
                {row.type}
              </Typography>
            </Box>
            <ChevronRightIcon fontSize="small" color="action" />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};
