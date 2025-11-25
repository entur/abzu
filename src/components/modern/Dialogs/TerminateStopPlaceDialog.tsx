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

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import {
  DateTimeSelection,
  StopPlaceInfo,
  TerminationOptions,
  UsageWarning,
} from "./TerminateStopPlaceDialog/components";
import {
  useTerminateDialog,
  WarningInfo,
} from "./TerminateStopPlaceDialog/hooks/useTerminateDialog";

interface ValidBetween {
  fromDate?: string;
  toDate?: string;
}

interface StopPlace {
  id?: string;
  name: string;
  hasExpired?: boolean;
  isChildOfParent?: boolean;
}

export interface TerminateStopPlaceDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (
    shouldHardDelete: boolean,
    shouldTerminatePermanently: boolean,
    comment: string,
    dateTime: string,
  ) => void;
  stopPlace: StopPlace;
  previousValidBetween?: ValidBetween;
  canDeleteStop?: boolean;
  isLoading?: boolean;
  serverTimeDiff: number;
  warningInfo?: WarningInfo | string;
}

/**
 * Terminate Stop Place Dialog component
 * Refactored into focused components for better maintainability
 * Handles stop place termination with date/time selection and various options
 */
export const TerminateStopPlaceDialog: React.FC<
  TerminateStopPlaceDialogProps
> = ({
  open,
  handleClose,
  handleConfirm,
  stopPlace,
  previousValidBetween,
  canDeleteStop,
  isLoading,
  serverTimeDiff,
  warningInfo,
}) => {
  const { formatMessage } = useIntl();

  const {
    state,
    setState,
    shouldHardDelete,
    shouldTerminatePermanently,
    date,
    time,
    comment,
    earliestFrom,
    dateTimeDisabled,
    getConfirmIsDisabled,
    handleConfirmClick,
  } = useTerminateDialog({
    open,
    stopPlace,
    previousValidBetween,
    serverTimeDiff,
    isLoading,
    warningInfo,
    handleConfirm,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "terminate_stop_title" })}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <StopPlaceInfo
            stopPlaceName={stopPlace.name}
            stopPlaceId={stopPlace.id}
            hasExpired={stopPlace.hasExpired}
          />

          <UsageWarning
            warningInfo={warningInfo}
            stopPlaceId={stopPlace.id}
            date={date}
          />

          <DateTimeSelection
            date={date}
            time={time}
            comment={comment}
            earliestFrom={earliestFrom}
            disabled={dateTimeDisabled}
            onDateChange={(newValue) =>
              newValue && setState({ ...state, date: newValue })
            }
            onTimeChange={(newValue) =>
              newValue && setState({ ...state, time: newValue })
            }
            onCommentChange={(value) => setState({ ...state, comment: value })}
          />

          <TerminationOptions
            shouldTerminatePermanently={shouldTerminatePermanently}
            shouldHardDelete={shouldHardDelete}
            canDeleteStop={canDeleteStop}
            onTerminatePermanentlyChange={(checked) =>
              setState({ ...state, shouldTerminatePermanently: checked })
            }
            onHardDeleteChange={(checked) =>
              setState({ ...state, shouldHardDelete: checked })
            }
          />

          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button variant="outlined" onClick={handleClose}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmClick}
              disabled={getConfirmIsDisabled()}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {formatMessage({ id: "confirm" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
