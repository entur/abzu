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
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import LinkIcon from "@mui/icons-material/Link";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlacesGroupActions, UserActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useCanEditOnMap } from "../hooks/useCanEditOnMap";
import { useIsEditingGroup } from "../hooks/useIsEditingGroup";
import { MarkerPopup } from "./MarkerPopup";
import type { MapStopPlace } from "./types";

interface StopPlacePopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  stopPlace: MapStopPlace;
  lat: number;
  lng: number;
  onOpen?: () => void;
  /** Opens the exact-coordinates dialog (F-76); omitted when read-only. */
  onEditCoordinates?: () => void;
  /** Moves the stop to the centre of its quays or children (F-30); omitted
   *  when there's nothing to centre on or the popup isn't the open stop's. */
  onAdjustCentroid?: () => void;
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
  onOpen,
  onEditCoordinates,
  onAdjustCentroid,
}: StopPlacePopupProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { modalityConfig } = useConfig();
  const groupCurrent = useAppSelector(
    (state) => (state as any).stopPlacesGroup?.current,
  );
  // Also false on an older version (F-96) and for a terminated stop.
  const canEdit = useCanEditOnMap(stopPlace);
  // From the route: the group outlives its editor in Redux (F-88).
  const isEditingGroup = useIsEditingGroup();
  const isGroupMember =
    isEditingGroup &&
    (groupCurrent?.members ?? []).some(
      (m: { id: string }) => m.id === stopPlace.id,
    );

  const hasSavedId = !!stopPlace.id && !stopPlace.id.startsWith("new_");
  const expired = !!stopPlace.hasExpired || !!stopPlace.permanentlyTerminated;

  // Creating a group or a multimodal stop from a stop needs edit rights on
  // it, and the deployment may switch either off (legacy parity, F-12b).
  const showCreateGroup =
    hasSavedId &&
    canEdit &&
    !modalityConfig?.disableGroupOfStopPlacesCreation &&
    !expired &&
    !stopPlace.isParent &&
    !stopPlace.isChildOfParent &&
    !stopPlace.belongsToGroup &&
    !isEditingGroup;

  const showCreateMultimodal =
    hasSavedId &&
    canEdit &&
    !modalityConfig?.disableMultiModalStopPlaceCreation &&
    !expired &&
    !stopPlace.isParent &&
    !stopPlace.isChildOfParent;

  // Ordinary stops too, as in legacy (F-30): centred on quays or children.
  const showAdjustCentroid = !!onAdjustCentroid && canEdit && !expired;

  const showConnectAdjacent =
    hasSavedId && !expired && !!stopPlace.isChildOfParent && canEdit;

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
    onAdjustCentroid?.();
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
      onEditCoordinates={onEditCoordinates}
      minWidth={220}
    >
      {onOpen && (
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            startIcon={<OpenInFullIcon />}
            onClick={onOpen}
          >
            {formatMessage({ id: "open" })}
          </Button>
        </Box>
      )}

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
                startIcon={<GroupWorkIcon />}
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
                startIcon={<AccountTreeIcon />}
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
                startIcon={<LinkOffIcon />}
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
