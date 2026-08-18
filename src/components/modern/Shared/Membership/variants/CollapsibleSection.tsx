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
  AccountTree as ParentIcon,
  ChevronRight as ChevronIcon,
  ExpandLess,
  ExpandMore,
  GroupWork as GroupIcon,
  Hub as RelationsIcon,
} from "@mui/icons-material";
import { Box, Chip, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "section" — reuses the panel's own information architecture: a
 * collapsible section header with an icon, title, count chip and expand toggle,
 * exactly like the Quays and Parking sections. Memberships stop being a special
 * case and become just another section the user can fold away.
 */
export const CollapsibleSection: React.FC<MembershipProps> = ({
  parentStop,
  groups,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();
  const [open, setOpen] = useState(true);

  const count = (parentStop ? 1 : 0) + (groups?.length ?? 0);

  const rows = [
    ...(parentStop
      ? [
          {
            id: parentStop.id,
            name: parentStop.name,
            type: formatMessage({ id: "parent_stop_place" }),
            icon: <ParentIcon sx={{ fontSize: "1.1rem" }} />,
            onClick: () => nav.goToParent(parentStop.id, parentStop.name),
          },
        ]
      : []),
    ...(groups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      type: formatMessage({ id: "group_of_stop_places" }),
      icon: <GroupIcon sx={{ fontSize: "1.1rem" }} />,
      onClick: () => nav.goToGroup(group.id, group.name),
    })),
  ];

  return (
    <Box
      sx={{
        mb: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
      }}
    >
      <MembershipLoading nav={nav} />

      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <RelationsIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {formatMessage({ id: "stop_place_relations" })}
        </Typography>
        <Chip label={count} size="small" sx={{ height: 20, minWidth: 20 }} />
        <Box sx={{ flex: 1 }} />
        {open ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        )}
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {rows.map((row) => (
          <Box
            key={row.id}
            onClick={row.onClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderTop: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ color: "text.secondary", display: "flex" }}>
              {row.icon}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" noWrap>
                {row.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.type}
              </Typography>
            </Box>
            <ChevronIcon fontSize="small" sx={{ color: "text.disabled" }} />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};
