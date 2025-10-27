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

import { GroupWork as GroupIcon } from "@mui/icons-material";
import { Box, Chip, Link, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import Routes from "../../../routes/";

interface Group {
  id: string;
  name: string;
}

interface GroupMembershipProps {
  groups: Group[];
}

/**
 * Modern replacement for BelongsToGroup component
 * Shows group memberships as clickable chips
 */
export const GroupMembership: React.FC<GroupMembershipProps> = ({ groups }) => {
  const { formatMessage } = useIntl();

  if (!groups || groups.length === 0) return null;

  const basename = import.meta.env.BASE_URL;

  const getGroupUrl = (id: string) => {
    // Remove trailing slash from basename if present, then construct clean path
    const cleanBasename = basename.endsWith("/")
      ? basename.slice(0, -1)
      : basename;
    return `${window.location.origin}${cleanBasename}/${Routes.GROUP_OF_STOP_PLACE}/${id}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
        mb: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
        {formatMessage({ id: "belongs_to_groups" })}:
      </Typography>
      {groups.map((group) => (
        <Link
          key={group.id}
          href={getGroupUrl(group.id)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <Chip
            icon={<GroupIcon />}
            label={group.name}
            size="small"
            clickable
            color="primary"
            variant="outlined"
          />
        </Link>
      ))}
    </Box>
  );
};
