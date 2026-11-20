/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { hasInvalidAvailabilityConditions } from "../../../../models/availabilityCondition";
import {
  isStopPlaceTypeValid,
  useHiddenStopTypes,
} from "../../Shared/StopNameAndType";
import { StopPlace } from "../types";
import {
  canOfferTerminate,
  hasSomethingToSave,
} from "../utils/stopPlaceActionRules";

interface StopPlaceActionBarProps {
  stopPlace: StopPlace;
  canEdit: boolean;
  canDelete: boolean;
  isModified: boolean;
  onOpenTerminateDialog: () => void;
  onOpenUndoDialog: () => void;
  onOpenSaveDialog: () => void;
  /** Draws the divider above the bar; it goes away with the bar. */
  withDivider?: boolean;
  /** False under the quay and parking panels: no Deactivate next to them. */
  showTerminate?: boolean;
}

/**
 * Terminate / undo / save for the stop place.
 *
 * Shared by the expanded panel and the collapsed bar: collapsing the panel must
 * not hide the fact that there are unsaved changes, nor the means to save them.
 * That was the core of the feedback about editing in a collapsed state.
 */
export const StopPlaceActionBar = ({
  stopPlace,
  canEdit,
  canDelete,
  isModified,
  onOpenTerminateDialog,
  onOpenUndoDialog,
  onOpenSaveDialog,
  withDivider = false,
  showTerminate = true,
}: StopPlaceActionBarProps) => {
  const { formatMessage } = useIntl();
  const hiddenStopTypes = useHiddenStopTypes();
  /* Domain rule (F-15): a stop needs a name and a valid type to be saved.
     An expired stop can be saved unchanged, which reactivates it. */
  const canSave =
    hasSomethingToSave(isModified, stopPlace.hasExpired) &&
    Boolean(stopPlace.name?.trim()) &&
    !hasInvalidAvailabilityConditions(stopPlace.parking) &&
    isStopPlaceTypeValid(stopPlace.stopPlaceType, hiddenStopTypes);
  const showDelete =
    showTerminate && canOfferTerminate(stopPlace, canEdit, canDelete);
  const showUndo = canEdit || isModified;

  /* Nothing to offer (e.g. an older version, or a read-only stop): no bar,
     rather than an empty band at the bottom of the drawer. */
  if (!showDelete && !showUndo && !canEdit) return null;

  return (
    <>
      {withDivider && <Divider />}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {showDelete && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onOpenTerminateDialog}
          >
            {formatMessage({
              id: stopPlace.hasExpired
                ? "delete_stop_place"
                : "terminate_stop_place",
            })}
          </Button>
        )}
        {/* Discard stays while there is something to discard, even if editing
          is no longer allowed: losing it locked users in with their changes
          (F-106). */}
        {showUndo && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<UndoIcon />}
            onClick={onOpenUndoDialog}
            disabled={!isModified}
            sx={{ ml: "auto" }}
          >
            {formatMessage({ id: "undo_changes" })}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={onOpenSaveDialog}
            disabled={!canSave}
          >
            {/* "Save stop place": the bar also sits under the quay and parking
              panels, where a bare "Save" read as "save this quay" (F-24). */}
            {formatMessage({ id: "save_stop_place" })}
          </Button>
        )}
      </Box>
    </>
  );
};
