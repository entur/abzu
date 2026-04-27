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

import CallMergeIcon from "@mui/icons-material/CallMerge";
import CancelIcon from "@mui/icons-material/Cancel";
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
import { useState } from "react";
import { useIntl } from "react-intl";
import { UserActions } from "../../../actions";
import {
  getStopPlaceWithAll,
  mergeAllQuaysFromStop,
} from "../../../actions/TiamatActions";
import * as types from "../../../actions/Types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/**
 * Dialog for merging a neighbouring stop place into the currently-edited stop.
 * Triggered from NeighbourStopPopup → UserActions.showMergeStopDialog.
 * Self-contained: reads its own Redux state; caller only needs to render it.
 */
export const MergeStopPlaceDialog = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const mergeSource = useAppSelector(
    (state) =>
      (state as any).stopPlace?.mergeStopDialog as {
        isOpen: boolean;
        id?: string;
        name?: string;
        quays?: { id: string; publicCode?: string }[];
      },
  );
  const current = useAppSelector(
    (state) =>
      (state as any).stopPlace?.current as {
        id?: string;
        name?: string;
      } | null,
  );
  const isFetchingMergeInfo = useAppSelector(
    (state) => !!(state as any).stopPlace?.isFetchingMergeInfo,
  );
  const stopHasBeenModified = useAppSelector(
    (state) => !!(state as any).stopPlace?.stopHasBeenModified,
  );

  const [changesUnderstood, setChangesUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = !!mergeSource?.isOpen;
  const fromId = mergeSource?.id;
  const fromName = mergeSource?.name;
  const quays = mergeSource?.quays ?? [];
  const toId = current?.id;
  const toName = current?.name;

  const enableConfirm =
    !isLoading &&
    !isFetchingMergeInfo &&
    (!stopHasBeenModified || changesUnderstood);

  const handleClose = () => {
    dispatch(UserActions.hideMergeStopDialog());
    setChangesUnderstood(false);
  };

  const handleConfirm = () => {
    if (!fromId || !toId) return;

    const fromVersionComment = `Flettet ${fromId} til ${toId}`;
    const toVersionComment = `Flettet ${fromId} til ${toId}`;

    setIsLoading(true);
    dispatch(
      mergeAllQuaysFromStop(fromId, toId, fromVersionComment, toVersionComment),
    )
      .then(() => {
        dispatch(UserActions.openSnackbar(types.SUCCESS));
        handleClose();
        dispatch(getStopPlaceWithAll(toId));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formatMessage({ id: "merge_stop_title" })}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
          {fromName} ({fromId}) → {toName} ({toId})
        </Typography>

        {stopHasBeenModified && (
          <Alert severity="warning" sx={{ mb: 1.5 }}>
            {formatMessage({ id: "merge_stop_warning" })}
          </Alert>
        )}

        {isFetchingMergeInfo ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              {formatMessage({ id: "loading" })}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary">
              {quays.length > 0
                ? formatMessage({ id: "merge_stop_new_quays" })
                : formatMessage({ id: "merge_stop_no_new_quays" })}
            </Typography>
            {quays.length > 0 && (
              <List dense sx={{ py: 0 }}>
                {quays.map((quay) => (
                  <ListItem key={quay.id} sx={{ py: 0.25, px: 0 }}>
                    <ListItemText
                      primary={`${quay.id}${quay.publicCode ? ` (${quay.publicCode})` : ""}`}
                      primaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}

        <Typography variant="body2" sx={{ mt: 1.5 }}>
          {formatMessage({ id: "merge_stop_info" })}
        </Typography>

        {stopHasBeenModified && (
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
            isLoading ? <CircularProgress size={16} /> : <CallMergeIcon />
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
