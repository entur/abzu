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
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { MembershipProps } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "path" — answers "where am I in the hierarchy?" by rendering the
 * containment chain as a breadcrumb, with the current stop as the non-clickable
 * final crumb. Groups follow as a second, subordinate line because group
 * membership is lateral rather than hierarchical.
 */
export const HierarchyPath: React.FC<MembershipProps> = ({
  parentStop,
  groups,
  currentName,
}) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();

  return (
    <Box sx={{ mb: 1.5 }}>
      <MembershipLoading nav={nav} />

      {parentStop && (
        <Breadcrumbs
          separator="›"
          aria-label={formatMessage({ id: "parent_stop_place" })}
          sx={{ fontSize: "0.8125rem" }}
        >
          <Link
            component="button"
            underline="hover"
            onClick={() => nav.goToParent(parentStop.id, parentStop.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.8125rem",
            }}
          >
            <ParentIcon sx={{ fontSize: "1rem" }} />
            {parentStop.name}
          </Link>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {currentName || formatMessage({ id: "stop_place" })}
          </Typography>
        </Breadcrumbs>
      )}

      {!!groups?.length && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.75,
            mt: parentStop ? 0.5 : 0,
            pl: parentStop ? 2 : 0,
          }}
        >
          <GroupIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          {groups.map((group, i) => (
            <Box
              key={group.id}
              sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
            >
              {i > 0 && (
                <Typography variant="caption" color="text.disabled">
                  ·
                </Typography>
              )}
              <Link
                component="button"
                variant="body2"
                underline="hover"
                onClick={() => nav.goToGroup(group.id, group.name)}
                sx={{ fontSize: "0.8125rem" }}
              >
                {group.name}
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
