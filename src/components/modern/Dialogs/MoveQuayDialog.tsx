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
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { UserActions } from "../../../actions";
import {
  getStopPlaceWithAll,
  moveQuaysToStop,
} from "../../../actions/TiamatActions";
import * as types from "../../../actions/Types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/**
 * Dialog for moving a quay from a neighbouring stop into the currently-edited stop.
 * Triggered from QuayPopup "Move to Current Stop" → UserActions.moveQuay.
 */
export const MoveQuayDialog = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const open = useAppSelector(
    (state) => !!(state as any).mapUtils?.moveQuayDialogOpen,
  );
  const movingQuay = useAppSelector(
    (state) =>
      (state as any).mapUtils?.movingQuay as {
        id: string;
        publicCode?: string;
        privateCode?: string;
        stopPlaceId?: string;
      } | null,
  );
  const currentStopId = useAppSelector(
    (state) => (state as any).stopPlace?.current?.id as string | undefined,
  );
  const stopHasBeenModified = useAppSelector(
    (state) => !!(state as any).stopPlace?.stopHasBeenModified,
  );

  const [changesUnderstood, setChangesUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const enableConfirm =
    !isLoading && (!stopHasBeenModified || changesUnderstood);

  const handleClose = () => {
    dispatch(UserActions.closeMoveQuayDialog());
    setChangesUnderstood(false);
  };

  const handleConfirm = () => {
    if (!movingQuay || !currentStopId) return;

    const fromVersionComment = `Flyttet ${movingQuay.id} til ${currentStopId}`;
    const toVersionComment = `Flyttet ${movingQuay.id} til ${currentStopId}`;

    setIsLoading(true);
    dispatch(
      moveQuaysToStop(
        currentStopId,
        movingQuay.id,
        fromVersionComment,
        toVersionComment,
      ),
    )
      .then(() => {
        dispatch(UserActions.openSnackbar(types.SUCCESS));
        handleClose();
        dispatch(getStopPlaceWithAll(currentStopId));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!movingQuay) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formatMessage({ id: "move_quay_title" })}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {movingQuay.id} → {currentStopId}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          {movingQuay.publicCode && (
            <Typography variant="caption" color="text.secondary">
              {formatMessage({ id: "publicCode" })}: {movingQuay.publicCode}
            </Typography>
          )}
          {movingQuay.privateCode && (
            <Typography variant="caption" color="text.secondary">
              {formatMessage({ id: "privateCode" })}: {movingQuay.privateCode}
            </Typography>
          )}
        </Box>

        <Typography variant="body2">
          {formatMessage({ id: "move_quay_info" })}
        </Typography>

        {stopHasBeenModified && (
          <>
            <Alert severity="warning" sx={{ mt: 1.5 }}>
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
              sx={{ mt: 1 }}
            />
          </>
        )}
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
