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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { AddMemberToGroup } from "../../Dialogs";
import { GroupOfStopPlacesListProps } from "../types";
import { StopPlaceListItem } from "./StopPlaceListItem";

/**
 * Collapsible list of stop places in a group — matches QuaysSection pattern
 */
export const GroupOfStopPlacesList: React.FC<GroupOfStopPlacesListProps> = ({
  stopPlaces,
  canEdit,
  onAddMembers,
  onRemoveMember,
}) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddMembers = (memberIds: string[]) => {
    onAddMembers(memberIds);
    setAddDialogOpen(false);
  };

  return (
    <Box>
      <Divider />

      {/* Section header — click to toggle */}
      <Box
        onClick={() => setExpanded((v) => !v)}
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
        <PlaceIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "stop_places" })}
        </Typography>
        <Chip label={stopPlaces.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
        <Tooltip title={formatMessage({ id: "add_stop_place_to_group" })}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setAddDialogOpen(true);
              }}
              disabled={!canEdit}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Collapsible list */}
      <Collapse in={expanded}>
        <Divider />
        {stopPlaces.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              {formatMessage({ id: "no_stop_places" })}
            </Typography>
          </Box>
        ) : (
          stopPlaces.map((stopPlace) => (
            <StopPlaceListItem
              key={`stop-place-${stopPlace.id}`}
              stopPlace={stopPlace}
              onRemove={onRemoveMember}
              disabled={!canEdit}
            />
          ))
        )}
      </Collapse>

      <AddMemberToGroup
        open={addDialogOpen}
        onConfirm={handleAddMembers}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );
};
