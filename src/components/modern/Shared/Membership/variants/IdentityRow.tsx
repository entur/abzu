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
  GroupWork as GroupIcon,
} from "@mui/icons-material";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "identity" — treats membership as identity metadata rather than a
 * form field: a single dense caption row of icon + name pairs, no labels, each
 * item explained by its tooltip. Uses the least vertical space, keeping the
 * editable fields at the top of the panel where they are the primary task.
 */
export const IdentityRow: React.FC<MembershipProps> = ({
  parentStop,
  groups,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();

  const items = [
    ...(parentStop
      ? [
          {
            id: parentStop.id,
            name: parentStop.name,
            tooltip: formatMessage({ id: "parent_stop_place" }),
            icon: <ParentIcon sx={{ fontSize: "0.95rem" }} />,
            onClick: () => nav.goToParent(parentStop.id, parentStop.name),
          },
        ]
      : []),
    ...(groups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      tooltip: formatMessage({ id: "group_of_stop_places" }),
      icon: <GroupIcon sx={{ fontSize: "0.95rem" }} />,
      onClick: () => nav.goToGroup(group.id, group.name),
    })),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.75,
        mb: 1,
        color: "text.secondary",
      }}
    >
      <MembershipLoading nav={nav} />
      {items.map((item, i) => (
        <Box
          key={item.id}
          sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
        >
          {i > 0 && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.25 }} />
          )}
          <Tooltip title={item.tooltip}>
            <Box
              onClick={item.onClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                cursor: "pointer",
                borderRadius: 0.5,
                px: 0.25,
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              {item.icon}
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {item.name}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      ))}
    </Box>
  );
};
