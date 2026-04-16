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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
  mergeQuays,
} from "../../../actions/TiamatActions";
import * as types from "../../../actions/Types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/**
 * Dialog for merging two quays within the same stop place.
 * Triggered after the two-step map workflow: start → complete.
 * Shows OTP usage warning when active service journeys are found.
 */
export const MergeQuayDialog = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const open = useAppSelector(
    (state) => !!(state as any).mapUtils?.mergingQuayDialogOpen,
  );
  const mergingQuay = useAppSelector(
    (state) =>
      (state as any).mapUtils?.mergingQuay as {
        fromQuay: { id: string; publicCode?: string } | null;
        toQuay: { id: string; publicCode?: string } | null;
      },
  );
  const mergeQuayWarning = useAppSelector(
    (state) =>
      (state as any).mapUtils?.mergeQuayWarning as {
        warning: boolean;
        authorities: string[];
      } | null,
  );
  const fetchOTPInfoMergeLoading = useAppSelector(
    (state) => !!(state as any).mapUtils?.fetchOTPInfoMergeLoading,
  );
  const stopHasBeenModified = useAppSelector(
    (state) => !!(state as any).stopPlace?.stopHasBeenModified,
  );
  const currentStopId = useAppSelector(
    (state) => (state as any).stopPlace?.current?.id as string | undefined,
  );

  const [changesUnderstood, setChangesUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fromQuay = mergingQuay?.fromQuay;
  const toQuay = mergingQuay?.toQuay;
  const hasOtpWarning = !!mergeQuayWarning?.warning;
  const authorities = mergeQuayWarning?.authorities ?? [];

  const enableConfirm =
    !isLoading &&
    !fetchOTPInfoMergeLoading &&
    (!stopHasBeenModified || changesUnderstood);

  const handleClose = () => {
    dispatch(UserActions.hideMergeQuaysDialog());
    setChangesUnderstood(false);
  };

  const handleConfirm = () => {
    if (!fromQuay || !toQuay || !currentStopId) return;

    const versionComment = `Flettet quay ${fromQuay.id} til ${toQuay.id}`;

    setIsLoading(true);
    dispatch(mergeQuays(currentStopId, fromQuay.id, toQuay.id, versionComment))
      .then(() => {
        dispatch(UserActions.openSnackbar(types.SUCCESS));
        handleClose();
        dispatch(getStopPlaceWithAll(currentStopId));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const quayLabel = (quay: { id: string; publicCode?: string }) =>
    quay.publicCode ? `${quay.id} (${quay.publicCode})` : quay.id;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formatMessage({ id: "merge_quays_title" })}</DialogTitle>
      <DialogContent>
        {fromQuay && toQuay && (
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
            {quayLabel(fromQuay)} → {quayLabel(toQuay)}
          </Typography>
        )}

        {stopHasBeenModified && (
          <Alert severity="warning" sx={{ mb: 1.5 }}>
            {formatMessage({ id: "merge_quays_warning" })}
          </Alert>
        )}

        {fetchOTPInfoMergeLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.5 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              {formatMessage({ id: "checking_quay_usage" })}
            </Typography>
          </Box>
        ) : (
          hasOtpWarning && (
            <Alert
              severity="error"
              icon={<WarningAmberIcon />}
              sx={{ mb: 1.5 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {formatMessage({ id: "quay_usages_found" })}
              </Typography>
              {authorities.length > 0 && (
                <>
                  <Typography variant="caption">
                    {formatMessage({ id: "important_quay_usages_found" })}
                  </Typography>
                  <List dense disablePadding>
                    {authorities.map((authority) => (
                      <ListItem key={authority} disableGutters sx={{ py: 0 }}>
                        <ListItemText
                          primary={authority}
                          primaryTypographyProps={{
                            variant: "caption",
                            fontStyle: "italic",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Alert>
          )
        )}

        <Typography variant="body2" sx={{ mt: 1 }}>
          {formatMessage({ id: "merge_quays_info" })}
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
