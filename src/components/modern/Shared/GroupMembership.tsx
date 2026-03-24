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
import { Box, Chip, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { UserActions } from "../../../actions";
import { getGroupOfStopPlacesById } from "../../../actions/TiamatActions";
import Routes from "../../../routes/";
import { LoadingDialog } from "./LoadingDialog";

interface Group {
  id: string;
  name: string;
}

interface GroupMembershipProps {
  groups: Group[];
}

/**
 * Modern replacement for BelongsToGroup component
 * Shows group memberships as clickable chips with in-app navigation
 */
export const GroupMembership: React.FC<GroupMembershipProps> = ({ groups }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const [loading, setLoading] = useState(false);
  const [loadingName, setLoadingName] = useState("");

  const handleNavigate = useCallback(
    (id: string, name: string) => {
      flushSync(() => {
        setLoading(true);
        setLoadingName(name);
      });

      dispatch(getGroupOfStopPlacesById(id))
        .then(() => {
          dispatch(
            UserActions.navigateTo(`/${Routes.GROUP_OF_STOP_PLACE}/`, id),
          );
          // Loading stays true — component unmounts when new panel renders
        })
        .catch(() => {
          setLoading(false);
          setLoadingName("");
        });
    },
    [dispatch],
  );

  if (!groups || groups.length === 0) return null;

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
      <LoadingDialog
        open={loading}
        message={
          loadingName
            ? `${formatMessage({ id: "loading" })} ${loadingName}`
            : formatMessage({ id: "loading" })
        }
      />
      <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
        {formatMessage({ id: "belongs_to_groups" })}:
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
          onClick={() => handleNavigate(group.id, group.name)}
        />
      ))}
    </Box>
  );
};
