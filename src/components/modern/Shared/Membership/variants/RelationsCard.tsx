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
  Hub as RelationsIcon,
} from "@mui/icons-material";
import { Box, Link, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "card" — both relation types inside one outlined, titled container,
 * so memberships read as a single block of context rather than two stray rows
 * competing with the form fields below.
 */
export const RelationsCard: React.FC<MembershipProps> = ({
  parentStop,
  groups,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();

  const labelSx = {
    minWidth: 104,
    flexShrink: 0,
    color: "text.secondary",
  } as const;

  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5, borderRadius: 1.5 }}>
      <MembershipLoading nav={nav} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
        <RelationsIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {formatMessage({ id: "stop_place_relations" })}
        </Typography>
      </Box>

      {parentStop && (
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.5 }}>
          <Typography variant="caption" sx={labelSx}>
            {formatMessage({ id: "parent_stop_place" })}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ParentIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
            <Link
              component="button"
              variant="body2"
              underline="hover"
              onClick={() => nav.goToParent(parentStop.id, parentStop.name)}
            >
              {parentStop.name}
            </Link>
          </Box>
        </Box>
      )}

      {!!groups?.length && (
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="caption" sx={labelSx}>
            {formatMessage({ id: "group_of_stop_places" })}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.25,
              minWidth: 0,
            }}
          >
            {groups.map((group) => (
              <Box
                key={group.id}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <GroupIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                  onClick={() => nav.goToGroup(group.id, group.name)}
                >
                  {group.name}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
