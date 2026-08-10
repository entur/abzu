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
  GroupWork as GroupIcon,
} from "@mui/icons-material";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "list" — one uniform row per relation, avatar-led, with the relation
 * type as secondary text. Treats parent and group identically so the user scans
 * a single list instead of parsing two differently-shaped rows. The type label
 * carries the distinction rather than the layout.
 */
export const RelationList: React.FC<MembershipProps> = ({
  parentStop,
  groups,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();

  const rows = [
    ...(parentStop
      ? [
          {
            id: parentStop.id,
            name: parentStop.name,
            type: formatMessage({ id: "parent_stop_place" }),
            icon: <ParentIcon sx={{ fontSize: "1.1rem" }} />,
            colour: "primary.main",
            onClick: () => nav.goToParent(parentStop.id, parentStop.name),
          },
        ]
      : []),
    ...(groups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      type: formatMessage({ id: "group_of_stop_places" }),
      icon: <GroupIcon sx={{ fontSize: "1.1rem" }} />,
      colour: "secondary.main",
      onClick: () => nav.goToGroup(group.id, group.name),
    })),
  ];

  return (
    <List disablePadding sx={{ mb: 1.5 }}>
      <MembershipLoading nav={nav} />
      {rows.map((row) => (
        <ListItemButton
          key={row.id}
          onClick={row.onClick}
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            border: "1px solid",
            borderColor: "divider",
            py: 0.5,
          }}
        >
          <ListItemAvatar sx={{ minWidth: 40 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: row.colour }}>
              {row.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={row.name}
            secondary={row.type}
            slotProps={{
              primary: { variant: "body2", noWrap: true },
              secondary: { variant: "caption" },
            }}
          />
          <ChevronIcon fontSize="small" sx={{ color: "text.disabled" }} />
        </ListItemButton>
      ))}
    </List>
  );
};
