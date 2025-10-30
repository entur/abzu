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
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import helpers from "../../../modelUtils/mapToQueryVariables";
import { getEarliestFromDate } from "../../../utils/saveDialogUtils";
import { getStopPlaceSearchUrl } from "../../../utils/shamash";

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

interface WarningInfo {
  stopPlaceId?: string;
  warning?: boolean;
  loading?: boolean;
  error?: boolean;
  activeDatesSize?: number;
  latestActiveDate?: Moment;
  authorities?: string[];
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
  const { formatMessage, locale } = useIntl();

  const getInitialState = () => {
    const earliestFrom = getEarliestFromDate(
      previousValidBetween,
      serverTimeDiff,
    );
    return {
      shouldHardDelete: false,
      shouldTerminatePermanently: false,
      date: moment(earliestFrom),
      time: moment(earliestFrom),
      comment: "",
    };
  };

  const [state, setState] = useState(getInitialState());

  useEffect(() => {
    if (open) {
      setState(getInitialState());
    }
  }, [open, previousValidBetween, serverTimeDiff]);

  const { shouldHardDelete, shouldTerminatePermanently, date, time, comment } =
    state;

  const earliestFrom = getEarliestFromDate(
    previousValidBetween,
    serverTimeDiff,
  );

  const getConfirmIsDisabled = () => {
    const { isChildOfParent, hasExpired } = stopPlace;

    // Check if warning info is still loading
    if (
      typeof warningInfo === "object" &&
      warningInfo !== null &&
      warningInfo.loading
    ) {
      return true;
    }

    // Only possible to delete stop if stop has expired
    const expiredNotDeleteCondition = hasExpired
      ? !(hasExpired && shouldHardDelete)
      : false;

    return !!isChildOfParent || isLoading || expiredNotDeleteCondition;
  };

  const renderUsageWarning = () => {
    if (typeof warningInfo === "string" || !warningInfo) {
      return null;
    }

    const {
      stopPlaceId,
      warning,
      loading,
      error,
      activeDatesSize,
      latestActiveDate,
      authorities,
    } = warningInfo;

    if (loading) {
      return (
        <Alert
          severity="info"
          icon={<CircularProgress size={20} />}
          sx={{ mb: 2 }}
        >
          {formatMessage({ id: "checking_stop_place_usage" })}
        </Alert>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formatMessage({ id: "failed_checking_stop_place_usage" })}
        </Alert>
      );
    }

    if (warning && stopPlaceId === stopPlace.id && stopPlace && stopPlace.id) {
      const makeSomeNoise =
        activeDatesSize && latestActiveDate && latestActiveDate > date;
      const severity = makeSomeNoise ? "error" : "warning";

      const shamashUrl = getStopPlaceSearchUrl(stopPlaceId);

      return (
        <Alert severity={severity} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {formatMessage({ id: "stop_place_usages_found" })}
          </Typography>
          {makeSomeNoise && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {formatMessage({ id: "important_stop_place_usages_found" })}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", mb: 0.5 }}>
                {authorities && authorities.join(", ")}
              </Typography>
              <Link href={shamashUrl} target="_blank" rel="noopener noreferrer">
                {formatMessage({
                  id: "important_stop_places_usages_api_link",
                })}
              </Link>
            </Box>
          )}
        </Alert>
      );
    }

    return null;
  };

  const handleConfirmClick = () => {
    const dateTime = helpers.getFullUTCString(time, date);
    handleConfirm(
      shouldHardDelete,
      shouldTerminatePermanently,
      comment,
      dateTime,
    );
  };

  const dateTimeDisabled = shouldHardDelete || stopPlace.hasExpired;

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
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
            {`${stopPlace.name} (${stopPlace.id})`}
          </Typography>

          {stopPlace.hasExpired && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formatMessage({ id: "expired_can_only_be_deleted" })}
            </Alert>
          )}

          {renderUsageWarning()}

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <DatePicker
                label={formatMessage({ id: "date" })}
                disabled={dateTimeDisabled}
                minDate={moment(earliestFrom)}
                value={date}
                onChange={(newValue) =>
                  newValue && setState({ ...state, date: newValue })
                }
                format={
                  new Intl.DateTimeFormat(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format as any
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <TimePicker
                label={formatMessage({ id: "time" })}
                disabled={dateTimeDisabled}
                value={time}
                onChange={(newValue) =>
                  newValue && setState({ ...state, time: newValue })
                }
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            value={comment}
            disabled={dateTimeDisabled}
            fullWidth
            label={formatMessage({ id: "comment" })}
            onChange={(e) => setState({ ...state, comment: e.target.value })}
            sx={{ mb: 2 }}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldTerminatePermanently}
                  onChange={(e) =>
                    setState({
                      ...state,
                      shouldTerminatePermanently: e.target.checked,
                    })
                  }
                />
              }
              label={formatMessage({ id: "permanently_terminate_stop_place" })}
            />
            {canDeleteStop && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shouldHardDelete}
                    onChange={(e) =>
                      setState({
                        ...state,
                        shouldHardDelete: e.target.checked,
                      })
                    }
                  />
                }
                label={formatMessage({ id: "delete_stop_place" })}
              />
            )}
          </FormGroup>

          {shouldHardDelete && (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{ mt: 2, mb: 2 }}
            >
              {formatMessage({ id: "delete_stop_info" })}
            </Alert>
          )}

          {shouldTerminatePermanently && (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{ mt: 2, mb: 2 }}
            >
              {formatMessage({ id: "permanently_terminate_warning" })}
            </Alert>
          )}

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
