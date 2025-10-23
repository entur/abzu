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

import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, Fab, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { AddMemberToGroup } from "../../Dialogs";
import { GroupOfStopPlacesListProps } from "../types";
import { StopPlaceListItem } from "./StopPlaceListItem";

/**
 * List component for stop places in a group
 * Shows stop places with add/remove functionality
 */
export const GroupOfStopPlacesList: React.FC<GroupOfStopPlacesListProps> = ({
  stopPlaces,
  canEdit,
  onAddMembers,
  onRemoveMember,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddMembers = (memberIds: string[]) => {
    onAddMembers(memberIds);
    setAddDialogOpen(false);
  };

  return (
    <Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          px: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {formatMessage({ id: "stop_places" })}
        </Typography>
        <Fab
          size="small"
          onClick={() => setAddDialogOpen(true)}
          disabled={!canEdit}
          sx={{
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
      <Divider />

      <Box
        sx={{
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        {stopPlaces.map((stopPlace, index) => (
          <StopPlaceListItem
            key={`stop-place-${stopPlace.id}`}
            stopPlace={stopPlace}
            expanded={expandedIndex === index}
            onExpand={() => setExpandedIndex(index)}
            onCollapse={() => setExpandedIndex(-1)}
            onRemove={onRemoveMember}
            disabled={!canEdit}
          />
        ))}
      </Box>

      {stopPlaces.length === 0 && (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            {formatMessage({ id: "no_stop_places" })}
          </Typography>
        </Box>
      )}

      <AddMemberToGroup
        open={addDialogOpen}
        onConfirm={handleAddMembers}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );
};
