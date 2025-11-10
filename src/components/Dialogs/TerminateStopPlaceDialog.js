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

import { Cancel, Delete, DeleteForever, Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import helpers from "../../modelUtils/mapToQueryVariables";
import Spinner from "../../static/icons/spinner";
import { getEarliestFromDate } from "../../utils/saveDialogUtils";
import { getStopPlaceSearchUrl } from "../../utils/shamash";

class TerminateStopPlaceDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    warningInfo: PropTypes.object,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  getConfirmIsDisabled() {
    const { stopPlace, isLoading, warningInfo } = this.props;
    const { isChildOfParent, hasExpired } = stopPlace;
    const { shouldHardDelete } = this.state;

    // complete OTP usage check first
    if (warningInfo && warningInfo.loading) {
      return true;
    }

    // only possible to delete stop if stop has expired
    const expiredNotDeleteCondition = hasExpired
      ? !(hasExpired && shouldHardDelete)
      : false;
    return !!isChildOfParent || isLoading || expiredNotDeleteCondition;
  }

  getUsageWarning() {
    const { stopPlace, warningInfo, intl } = this.props;
    const { formatMessage } = intl;
    const { date } = this.state;

    if (warningInfo) {
      const {
        stopPlaceId,
        warning,
        loading,
        error,
        activeDatesSize,
        latestActiveDate,
        authorities,
      } = warningInfo;
      const infoStyle = { fontSize: "1.1em" };
      const alertStyle = { ...infoStyle, color: "#cc0000" };

      if (loading) {
        return (
          <div style={{ ...infoStyle, display: "flex", alignItems: "center" }}>
            <Spinner />
            <div style={{ marginLeft: 5 }}>
              {formatMessage({ id: "checking_stop_place_usage" })}
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div style={alertStyle}>
            {formatMessage({ id: "failed_checking_stop_place_usage" })}
          </div>
        );
      }

      if (
        warning &&
        stopPlaceId === stopPlace.id &&
        stopPlace &&
        stopPlace.id
      ) {
        const makeSomeNoise = activeDatesSize && latestActiveDate > date;
        const panicStyle = {
          color: "#000",
          padding: 10,
          border: "1px solid black",
          background: "rgb(252, 200, 197)",
        };
        const wrapperStyle = !makeSomeNoise ? alertStyle : panicStyle;

        const shamashUrl = getStopPlaceSearchUrl(stopPlaceId);

        return (
          <div style={wrapperStyle}>
            <div>{formatMessage({ id: "stop_place_usages_found" })}</div>
            {makeSomeNoise && (
              <div
                style={{
                  fontWeight: 600,
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.5",
                }}
              >
                <div>
                  {formatMessage({ id: "important_stop_place_usages_found" })}
                </div>
                <div style={{ fontStyle: "italic" }}>
                  {authorities && authorities.join(", ")}
                </div>
                <div>
                  <a target="_NEW" href={shamashUrl}>
                    {formatMessage({
                      id: "important_stop_places_usages_api_link",
                    })}
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  }

  getInitialState(props) {
    const earliestFrom = getEarliestFromDate(
      props.previousValidBetween,
      this.props.serverTimeDiff,
    );
    return {
      shouldHardDelete: false,
      shouldTerminatePermanently: false,
      date: earliestFrom,
      time: earliestFrom,
      comment: "",
    };
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      stopPlace,
      canDeleteStop,
      previousValidBetween,
      isLoading,
      serverTimeDiff,
    } = this.props;
    const { formatMessage } = intl;
    const {
      shouldHardDelete,
      shouldTerminatePermanently,
      date,
      time,
      comment,
    } = this.state;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "terminate_stop_title" }),
      permanentLabel: formatMessage({ id: "permanently_terminate_stop_place" }),
      deleteLabel: formatMessage({ id: "delete_stop_place" }),
      deleteWarning: formatMessage({ id: "delete_stop_info" }),
      permanentWarning: formatMessage({ id: "permanently_terminate_warning" }),
      cannotDelete: formatMessage({ id: "delete_stop_not_allowed" }),
      comment: formatMessage({ id: "comment" }),
      date: formatMessage({ id: "date" }),
      time: formatMessage({ id: "time" }),
    };

    const dateTime = helpers.getFullUTCString(time, date);
    const warningUsage = this.getUsageWarning();

    const earliestFrom = getEarliestFromDate(
      previousValidBetween,
      serverTimeDiff,
    );

    return (
      <Dialog
        fullWidth
        open={open}
        titleStyle={{ padding: "24px 24px 0px" }}
        onClose={() => {
          handleClose();
        }}
      >
        <DialogTitle>{translations.title}</DialogTitle>
        <DialogContent>
          <div>
            <div style={{ marginBottom: 10, color: "#000" }}>
              <span
                style={{ fontWeight: 600 }}
              >{`${stopPlace.name} (${stopPlace.id})`}</span>
            </div>
            <div style={{ color: "#bb271c" }}>
              {stopPlace.hasExpired &&
                formatMessage({ id: "expired_can_only_be_deleted" })}
            </div>
            {warningUsage}
            <div style={{ marginBottom: 10, marginTop: 10 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  hintText={translations.date}
                  disabled={shouldHardDelete || stopPlace.hasExpired}
                  cancelLabel={translations.cancel}
                  label={translations.date}
                  okLabel={translations.use}
                  DateTimeFormat={Intl.DateTimeFormat}
                  formatDate={
                    new Intl.DateTimeFormat(intl.locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format
                  }
                  autoOk
                  mode="landscape"
                  minDate={moment(earliestFrom)}
                  value={moment(date)}
                  fullWidth={true}
                  onChange={(event, value) => {
                    this.setState({ date: moment(value) });
                  }}
                />
                <span style={{ marginLeft: 10 }}>
                  <TimePicker
                    ampm={false}
                    cancelLabel={translations.cancel}
                    hintText={translations.time}
                    label={translations.time}
                    disabled={shouldHardDelete || stopPlace.hasExpired}
                    value={moment(time)}
                    fullWidth={true}
                    okLabel={translations.use}
                    autoOk
                    onChange={(value) => {
                      this.setState({
                        time: moment(value),
                      });
                    }}
                  />
                </span>
              </LocalizationProvider>
            </div>
            <TextField
              value={comment}
              variant={"standard"}
              disabled={shouldHardDelete || stopPlace.hasExpired}
              fullWidth={true}
              label={translations.comment}
              hintText={translations.comment}
              id="terminate-comment"
              onChange={(e) => this.setState({ comment: e.target.value })}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ marginTop: 5 }}
                    checked={shouldTerminatePermanently}
                    onChange={(e, v) =>
                      this.setState({ shouldTerminatePermanently: v })
                    }
                    label={translations.permanentLabel}
                  />
                }
                label={translations.permanentLabel}
              />
            </FormGroup>
            {canDeleteStop && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ marginTop: 5 }}
                      checked={shouldHardDelete}
                      onChange={(e, v) =>
                        this.setState({ shouldHardDelete: v })
                      }
                      label={translations.deleteLabel}
                    />
                  }
                  label={translations.deleteLabel}
                />
              </FormGroup>
            )}
            {shouldHardDelete && (
              <div style={{ marginLeft: 10, display: "flex", marginTop: 10 }}>
                <div style={{ marginTop: 0, marginRight: 5 }}>
                  <Warning color="orange" />
                </div>
                <span>{translations.deleteWarning}</span>
              </div>
            )}
            {shouldTerminatePermanently && (
              <div style={{ marginLeft: 10, display: "flex", marginTop: 10 }}>
                <div style={{ marginTop: 0, marginRight: 5 }}>
                  <Warning color="orange" />
                </div>
                <span>{translations.permanentWarning}</span>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleClose}
            startIcon={<Cancel />}
            color="secondary"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="text"
            onClick={() =>
              handleConfirm(
                shouldHardDelete,
                shouldTerminatePermanently,
                comment,
                dateTime,
              )
            }
            disabled={this.getConfirmIsDisabled()}
            startIcon={
              isLoading ? (
                <Spinner />
              ) : shouldHardDelete ? (
                <DeleteForever />
              ) : (
                <Delete />
              )
            }
          >
            {translations.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default TerminateStopPlaceDialog;
