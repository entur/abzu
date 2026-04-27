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
import AdjustIcon from "@mui/icons-material/Adjust";
import LinkIcon from "@mui/icons-material/Link";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import {
  StopPlaceActions,
  StopPlacesGroupActions,
  UserActions,
} from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { MarkerPopup } from "./MarkerPopup";
import type { MapStopPlace } from "./types";

interface StopPlacePopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  stopPlace: MapStopPlace;
  lat: number;
  lng: number;
}

/**
 * Popup for the active stop place marker.
 * Shows contextual action buttons based on stop state and current editing context.
 */
export const StopPlacePopup = ({
  anchorEl,
  onClose,
  stopPlace,
  lat,
  lng,
}: StopPlacePopupProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const groupCurrent = useAppSelector(
    (state) => (state as any).stopPlacesGroup?.current,
  );
  const canEdit = getStopPermissions(stopPlace).canEdit;

  const isEditingGroup = !!groupCurrent?.id;
  const isGroupMember =
    isEditingGroup &&
    (groupCurrent.members ?? []).some(
      (m: { id: string }) => m.id === stopPlace.id,
    );

  const hasSavedId = !!stopPlace.id && !stopPlace.id.startsWith("new_");
  const expired = !!stopPlace.hasExpired || !!stopPlace.permanentlyTerminated;

  const showCreateGroup =
    hasSavedId &&
    !expired &&
    !stopPlace.isParent &&
    !stopPlace.isChildOfParent &&
    !stopPlace.belongsToGroup &&
    !isEditingGroup;

  const showCreateMultimodal =
    hasSavedId && !expired && !stopPlace.isParent && !stopPlace.isChildOfParent;

  const showAdjustCentroid = !!stopPlace.isParent;

  const showConnectAdjacent =
    hasSavedId && !expired && !stopPlace.isParent && canEdit;

  const showRemoveFromGroup = isGroupMember && canEdit;

  const hasActions =
    showCreateGroup ||
    showCreateMultimodal ||
    showAdjustCentroid ||
    showConnectAdjacent ||
    showRemoveFromGroup;

  const handleCreateGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.useStopPlaceIdForNewGroup(stopPlace.id));
  };

  const handleCreateMultimodal = () => {
    onClose();
    dispatch(UserActions.createMultimodalWith(stopPlace.id, true));
  };

  const handleAdjustCentroid = () => {
    onClose();
    dispatch(StopPlaceActions.adjustCentroid());
  };

  const handleConnectAdjacent = () => {
    onClose();
    dispatch(UserActions.showAddAdjacentStopDialog(stopPlace.id));
  };

  const handleRemoveFromGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.removeMemberFromGroup(stopPlace.id));
  };

  return (
    <MarkerPopup
      anchorEl={anchorEl}
      onClose={onClose}
      title={stopPlace.name || formatMessage({ id: "untitled" })}
      id={stopPlace.id}
      lat={lat}
      lng={lng}
      minWidth={220}
    >
      {/* Contextual action buttons */}
      {hasActions && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {showAdjustCentroid && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AdjustIcon />}
                onClick={handleAdjustCentroid}
                fullWidth
              >
                {formatMessage({ id: "adjust_centroid" })}
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
            {showConnectAdjacent && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={handleConnectAdjacent}
                fullWidth
              >
                {formatMessage({ id: "connect_to_adjacent_stop" })}
              </Button>
            )}
            {showRemoveFromGroup && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<RemoveCircleOutlineIcon />}
                onClick={handleRemoveFromGroup}
                fullWidth
              >
                {formatMessage({ id: "remove_from_group" })}
              </Button>
            )}
          </Box>
        </>
      )}
    </MarkerPopup>
  );
};
