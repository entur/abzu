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

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LinkIcon from "@mui/icons-material/Link";
import MergeIcon from "@mui/icons-material/MergeType";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { StopPlacesGroupActions, UserActions } from "../../../../actions";
import { getNeighbourStopPlaceQuays } from "../../../../actions/TiamatActions.modern";
import AppRoutes from "../../../../routes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useCanEditOnMap } from "../hooks/useCanEditOnMap";
import { useIsEditingGroup } from "../hooks/useIsEditingGroup";
import { useMapCurrentStop } from "../hooks/useMapCurrentStop";
import { MarkerPopup } from "./MarkerPopup";
import type { MapStopPlace, NeighbourStop } from "./types";
import { useConfirmLeave } from "../../Shared/UnsavedChangesGuard";

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
  const confirmLeave = useConfirmLeave();

  const groupCurrent = useAppSelector(
    (state) => (state as any).stopPlacesGroup?.current,
  );
  // Both group-aware (F-88): the group and the previous stop both outlive
  // their editors in Redux, so offering actions by them alone acted on a
  // stop or group that was no longer open.
  const isEditingGroup = useIsEditingGroup();
  const currentStopPlace = useMapCurrentStop() as
    (MapStopPlace & { parentStop?: { children?: { id: string }[] } }) | null;
  const canEditCurrentStop = useCanEditOnMap(currentStopPlace);
  const areQuaysShown = useAppSelector(
    (state) => !!(state as any).stopPlace?.neighbourStopQuays?.[stop.id],
  );

  const isEditingStop = !!currentStopPlace?.id;
  const canEdit = !!stop.permissions?.canEdit;
  const expired = !!stop.hasExpired;
  const hasSavedId = !!stop.id;

  const siblingIds: string[] = currentStopPlace?.isChildOfParent
    ? (currentStopPlace?.parentStop?.children ?? []).map((child) => child.id)
    : [];
  const showConnectAdjacent =
    siblingIds.includes(stop.id) && canEdit && !expired;

  const isGroupMember =
    isEditingGroup &&
    (groupCurrent?.members ?? []).some((m: { id: string }) => m.id === stop.id);

  const showAddToGroup = isEditingGroup && canEdit && !isGroupMember;
  const showRemoveFromGroup = isEditingGroup && canEdit && isGroupMember;

  const isCurrentStopParent = !!currentStopPlace?.isParent;

  // Tiamat refuses to merge from a child of a multimodal stop ("Cannot merge
  // from childs of multi modal stop places", checked on dev for F-47), so the
  // child must be detached first. Merging into a multimodal or read-only stop
  // isn't offered either (legacy rule).
  const showMergeStop =
    hasSavedId &&
    !expired &&
    !stop.isParent &&
    !stop.isChildOfParent &&
    canEdit &&
    isEditingStop &&
    !isCurrentStopParent &&
    canEditCurrentStop;

  // Shows the neighbour's quays on the map, to look at or to move one to the
  // open stop (F-46). Also offered in a multimodal editor, for looking: the
  // move itself is hidden there (canMoveQuayToCurrent, F-101). Parents have
  // no quays of their own.
  const showQuaysToggle = hasSavedId && isEditingStop && !stop.isParent;

  const hasActions =
    showAddToGroup ||
    showRemoveFromGroup ||
    showMergeStop ||
    showConnectAdjacent ||
    showQuaysToggle;

  const handleOpen = () => {
    onClose();
    confirmLeave(() => navigate(`/${AppRoutes.STOP_PLACE}/${stop.id}`));
  };

  const handleAddToGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.addMemberToGroup(stop.id));
  };

  const handleRemoveFromGroup = () => {
    onClose();
    dispatch(StopPlacesGroupActions.removeMemberFromGroup(stop.id));
  };

  const handleMergeStop = () => {
    onClose();
    dispatch(UserActions.showMergeStopDialog(stop.id, stop.name));
  };

  const handleToggleQuays = () => {
    onClose();
    dispatch(
      areQuaysShown
        ? UserActions.hideQuaysForNeighbourStop(stop.id)
        : getNeighbourStopPlaceQuays(stop.id),
    );
  };

  const handleConnectAdjacent = () => {
    onClose();
    dispatch(UserActions.showAddAdjacentStopDialog(stop.id));
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
          variant="outlined"
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
            {showQuaysToggle && (
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  areQuaysShown ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
                onClick={handleToggleQuays}
                fullWidth
              >
                {formatMessage({
                  id: areQuaysShown ? "hide_quays" : "show_quays",
                })}
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
          </Box>
        </>
      )}
    </MarkerPopup>
  );
};
