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
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { DialogErrorAlert } from "./DialogErrorAlert";
import { useMoveQuayToCurrent } from "./hooks/useMoveQuayToCurrent";

/**
 * Dialog for moving a quay from a neighbouring stop into the currently-edited stop.
 * Triggered from a neighbour quay's popup ("Flytt til gjeldende", NeighbourQuayMarkers) → UserActions.moveQuay.
 */
export const MoveQuayDialog = () => {
  const { formatMessage } = useIntl();
  const {
    open,
    movingQuay,
    currentStopId,
    stopHasBeenModified,
    emptiedStopName,
    isMoving,
    errorMessageId,
    confirm,
    close,
  } = useMoveQuayToCurrent();
  const [changesUnderstood, setChangesUnderstood] = useState(false);

  const enableConfirm =
    !isMoving && (!stopHasBeenModified || changesUnderstood);

  // Also after a successful move, which closes the dialog through Redux.
  useEffect(() => {
    if (!open) setChangesUnderstood(false);
  }, [open]);

  if (!movingQuay) return null;

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
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

        {emptiedStopName && (
          <Alert severity="warning" sx={{ mt: 1.5 }}>
            {formatMessage(
              { id: "move_quay_last_quay_warning" },
              { name: emptiedStopName },
            )}
          </Alert>
        )}

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
        <DialogErrorAlert messageId={errorMessageId} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
          onClick={close}
        >
          {formatMessage({ id: "cancel" })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isMoving ? <CircularProgress size={16} /> : <DriveFileMoveIcon />
          }
          onClick={confirm}
          disabled={!enableConfirm}
        >
          {formatMessage({ id: "confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
