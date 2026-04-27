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

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LinkIcon from "@mui/icons-material/Link";
import MergeIcon from "@mui/icons-material/MergeType";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  StopPlaceActions,
  StopPlacesGroupActions,
  UserActions,
} from "../../../../actions";
import AppRoutes from "../../../../routes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { MarkerPopup } from "./MarkerPopup";
import type { NeighbourStop } from "./types";

interface NeighbourStopPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  stop: NeighbourStop;
  lat: number;
  lng: number;
}

/**
 * Popup for neighbour stop markers.
 * Shows contextual actions based on the current editing context (group, stop, or overview).
 */
export const NeighbourStopPopup = ({
  anchorEl,
  onClose,
  stop,
  lat,
  lng,
}: NeighbourStopPopupProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const groupCurrent = useAppSelector(
    (state) => (state as any).stopPlacesGroup?.current,
  );
  const currentStopPlace = useAppSelector(
    (state) => (state as any).stopPlace?.current,
  );

  const isEditingGroup = !!groupCurrent?.id;
  const isEditingStop = !!currentStopPlace?.id;
  const canEdit = !!stop.permissions?.canEdit;
  const expired = !!stop.hasExpired;
  const hasSavedId = !!stop.id;

  const isGroupMember =
    isEditingGroup &&
    (groupCurrent.members ?? []).some((m: { id: string }) => m.id === stop.id);

  const showAddToGroup = isEditingGroup && canEdit && !isGroupMember;

  const showCreateGroup =
    hasSavedId &&
    !expired &&
    !stop.isChildOfParent &&
    !stop.isParent &&
    canEdit &&
    !isEditingGroup;

  const showCreateMultimodal =
    hasSavedId &&
    !expired &&
    !stop.isParent &&
    !stop.isChildOfParent &&
    canEdit &&
    !isEditingGroup;

  const showMergeStop =
    hasSavedId &&
    !expired &&
    !stop.isParent &&
    !stop.isChildOfParent &&
    canEdit &&
    isEditingStop;

  const hasActions =
    showAddToGroup || showCreateGroup || showCreateMultimodal || showMergeStop;

  const handleOpen = () => {
    onClose();
    dispatch(StopPlaceActions.setStopPlaceLoading(true));
    navigate(`/${AppRoutes.STOP_PLACE}/${stop.id}`);
  };

  const handleAddToGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.addMemberToGroup(stop.id));
  };

  const handleCreateGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.useStopPlaceIdForNewGroup(stop.id));
  };

  const handleCreateMultimodal = () => {
    onClose();
    dispatch(UserActions.createMultimodalWith(stop.id, false));
  };

  const handleMergeStop = () => {
    onClose();
    dispatch(UserActions.showMergeStopDialog(stop.id, stop.name));
  };

  return (
    <MarkerPopup
      anchorEl={anchorEl}
      onClose={onClose}
      title={stop.name || stop.id}
      id={stop.name ? stop.id : undefined}
      lat={lat}
      lng={lng}
      minWidth={200}
    >
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          startIcon={<OpenInFullIcon />}
          onClick={handleOpen}
        >
          {formatMessage({ id: "open" })}
        </Button>
      </Box>

      {hasActions && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {showAddToGroup && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<GroupAddIcon />}
                onClick={handleAddToGroup}
                fullWidth
              >
                {formatMessage({ id: "add_to_group" })}
              </Button>
            )}
            {showCreateGroup && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AccountTreeIcon />}
                onClick={handleCreateGroup}
                fullWidth
              >
                {formatMessage({ id: "create_group_of_stop_places" })}
              </Button>
            )}
            {showCreateMultimodal && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={handleCreateMultimodal}
                fullWidth
              >
                {formatMessage({ id: "new__multi_stop" })}
              </Button>
            )}
            {showMergeStop && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<MergeIcon />}
                onClick={handleMergeStop}
                fullWidth
              >
                {formatMessage({ id: "merge_stop_here" })}
              </Button>
            )}
          </Box>
        </>
      )}
    </MarkerPopup>
  );
};
