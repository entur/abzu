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

import CancelIcon from "@mui/icons-material/Cancel";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { UserActions } from "../../../actions";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getModalityAllowance,
  isModalityAllowed,
  isStopPlaceTypeValid,
  StopNameAndTypeFields,
  useHiddenStopTypes,
} from "../Shared/StopNameAndType";
import { useMoveQuaysToNewStop } from "./hooks/useMoveQuaysToNewStop";

interface SelectableQuay {
  id: string;
  publicCode?: string;
  privateCode?: string;
}

/**
 * Dialog for moving one or more quays out of the current stop into a brand-new stop place.
 * Triggered from QuayPopup "Move to New Stop Place" → UserActions.moveQuayToNewStopPlace.
 * Lets the user select additional quays from the same stop to move alongside the initiating quay,
 * and asks for the new stop's name and type: a stop can't be saved without them (F-40).
 */
export const MoveQuayNewStopDialog = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const open = useAppSelector(
    (state) => !!(state as any).mapUtils?.moveQuayToNewStopDialogOpen,
  );
  const movingQuay = useAppSelector(
    (state) =>
      (state as any).mapUtils?.movingQuayToNewStop as {
        id: string;
        publicCode?: string;
        privateCode?: string;
        stopPlaceId?: string;
      } | null,
  );
  const currentStop = useAppSelector(
    (state) =>
      (state as any).stopPlace?.current as {
        id?: string;
        quays?: SelectableQuay[];
        permissions?: Parameters<typeof getModalityAllowance>[0];
      } | null,
  );
  const stopHasBeenModified = useAppSelector(
    (state) => !!(state as any).stopPlace?.stopHasBeenModified,
  );

  const [selectedQuayIds, setSelectedQuayIds] = useState<string[]>([]);
  const [changesUnderstood, setChangesUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStopName, setNewStopName] = useState("");
  const [newStopType, setNewStopType] = useState("");
  const [hasMoveFailed, setHasMoveFailed] = useState(false);
  const hiddenStopTypes = useHiddenStopTypes();
  const moveQuaysToNewStop = useMoveQuaysToNewStop();

  // Pre-select the initiating quay whenever the dialog opens
  useEffect(() => {
    if (open && movingQuay) {
      setSelectedQuayIds([movingQuay.id]);
      setChangesUnderstood(false);
      setNewStopName("");
      setNewStopType("");
      setHasMoveFailed(false);
    }
  }, [open, movingQuay?.id]);

  const allQuays: SelectableQuay[] = currentStop?.quays ?? [];
  // The new stop gets the moved quays' location; the current stop's
  // permissions are the closest known proxy for what may be chosen (F-18).
  const allowance = getModalityAllowance(currentStop?.permissions);
  const currentStopId = currentStop?.id;

  const enableConfirm =
    !isLoading &&
    selectedQuayIds.length > 0 &&
    newStopName.trim().length > 0 &&
    isStopPlaceTypeValid(newStopType, hiddenStopTypes) &&
    isModalityAllowed(allowance, newStopType, null) &&
    (!stopHasBeenModified || changesUnderstood);

  const handleToggleQuay = (quayId: string) => {
    setSelectedQuayIds((prev) =>
      prev.includes(quayId)
        ? prev.filter((id) => id !== quayId)
        : [...prev, quayId],
    );
  };

  const handleClose = () => {
    dispatch(UserActions.closeMoveQuayToNewStopDialog());
    setChangesUnderstood(false);
  };

  const handleConfirm = () => {
    if (selectedQuayIds.length === 0 || !currentStopId || !movingQuay) return;

    setIsLoading(true);
    setHasMoveFailed(false);
    moveQuaysToNewStop({
      quayIds: selectedQuayIds,
      sourceStopId: movingQuay.stopPlaceId ?? currentStopId,
      name: newStopName.trim(),
      stopType: newStopType,
    })
      .then(handleClose)
      .catch(() => setHasMoveFailed(true))
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!movingQuay) return null;

  const consequenceKey =
    selectedQuayIds.length > 1
      ? "move_quay_new_stop_consequence_pl"
      : "move_quay_new_stop_consequence";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formatMessage({ id: "move_quay_new_stop_title" })}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
          {selectedQuayIds.length} {formatMessage({ id: consequenceKey })}
        </Typography>

        <List
          dense
          sx={{ border: 1, borderColor: "divider", borderRadius: 1, mb: 1.5 }}
        >
          {allQuays.map((quay) => {
            const label = quay.publicCode
              ? `${quay.id} (${quay.publicCode})`
              : quay.id;
            return (
              <ListItem key={quay.id} sx={{ py: 0.25 }}>
                <FormControlLabel
                  sx={{ width: "100%", mx: 0 }}
                  control={
                    <Checkbox
                      checked={selectedQuayIds.includes(quay.id)}
                      onChange={() => handleToggleQuay(quay.id)}
                      size="small"
                      sx={{ py: 0.5 }}
                    />
                  }
                  label={
                    <ListItemText
                      primary={label}
                      slotProps={{ primary: { variant: "body2" } }}
                    />
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 1.5 }}>
          <StopNameAndTypeFields
            name={newStopName}
            stopType={newStopType}
            onNameChange={setNewStopName}
            onStopTypeChange={setNewStopType}
            allowance={allowance}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatMessage({ id: "move_quay_new_stop_info" })}
          </Typography>

          {hasMoveFailed && (
            <Alert severity="error">
              {formatMessage({
                id: "humanReadableErrorCodes.ERROR_STOP_PLACE",
              })}
            </Alert>
          )}

          {stopHasBeenModified && (
            <>
              <Alert severity="warning">
                {formatMessage({ id: "merge_stop_warning" })}
              </Alert>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changesUnderstood}
                    onChange={(_, checked) => setChangesUnderstood(checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {formatMessage({ id: "accept_changes" })}
                  </Typography>
                }
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
          onClick={handleClose}
        >
          {formatMessage({ id: "cancel" })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isLoading ? <CircularProgress size={16} /> : <DriveFileMoveIcon />
          }
          onClick={handleConfirm}
          disabled={!enableConfirm}
        >
          {formatMessage({ id: "confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
