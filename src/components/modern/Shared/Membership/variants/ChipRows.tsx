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
import { Box, Chip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { MembershipProps, withColon } from "../types";
import { useMembershipNavigation } from "../useMembershipNavigation";
import { MembershipLoading } from "./MembershipLoading";

/**
 * Variant "chips" — the original layout, kept as the baseline to compare
 * against: one labelled row per relation type, chips inline after the label.
 */
export const ChipRows: React.FC<MembershipProps> = ({ parentStop, groups }) => {
  const { formatMessage } = useIntl();
  const nav = useMembershipNavigation();

  const rowSx = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 0.5,
    mb: 1,
  } as const;

  return (
    <>
      <MembershipLoading nav={nav} />
      {parentStop && (
        <Box sx={rowSx}>
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
            {withColon(formatMessage({ id: "parent_stop_place" }))}
          </Typography>
          <Chip
            icon={<ParentIcon />}
            label={parentStop.name}
            size="small"
            clickable
            color="primary"
            variant="outlined"
            onClick={() => nav.goToParent(parentStop.id, parentStop.name)}
          />
        </Box>
      )}

      {!!groups?.length && (
        <Box sx={rowSx}>
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
            {withColon(formatMessage({ id: "belongs_to_groups" }))}
          </Typography>
          {groups.map((group) => (
            <Chip
              key={group.id}
              icon={<GroupIcon />}
              label={group.name}
              size="small"
              clickable
              color="primary"
              variant="outlined"
              onClick={() => nav.goToGroup(group.id, group.name)}
            />
          ))}
        </Box>
      )}
    </>
  );
};
