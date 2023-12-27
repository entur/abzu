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

import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import TimePicker from "material-ui/TimePicker";
import DatePicker from "material-ui/DatePicker";
import { getEarliestFromDate } from "../../utils/saveDialogUtils";
import areIntlLocalesSupported from "intl-locales-supported";
import TextField from "material-ui/TextField";
import helpers from "../../modelUtils/mapToQueryVariables";
import Spinner from "../../static/icons/spinner";
import { getStopPlaceSearchUrl } from "../../utils/shamash";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Cancel, Delete, DeleteForever, Warning } from "@mui/icons-material";

let DateTimeFormat;

if (areIntlLocalesSupported(["nb"])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require("intl");
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require("intl/locale-data/jsonp/nb");
}

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
            <DatePicker
              hintText={translations.date}
              disabled={shouldHardDelete || stopPlace.hasExpired}
              cancelLabel={translations.cancel}
              floatingLabelText={translations.date}
              okLabel={translations.use}
              DateTimeFormat={DateTimeFormat}
              formatDate={
                new DateTimeFormat(intl.locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format
              }
              autoOk
              mode="landscape"
              minDate={earliestFrom}
              value={date}
              fullWidth={true}
              onChange={(event, value) => {
                this.setState({ date: value });
              }}
            />
            <TimePicker
              format="24hr"
              cancelLabel={translations.cancel}
              hintText={translations.time}
              floatingLabelText={translations.time}
              disabled={shouldHardDelete || stopPlace.hasExpired}
              value={time}
              fullWidth={true}
              okLabel={translations.use}
              autoOk
              onChange={(event, value) => {
                this.setState({
                  time: value,
                });
              }}
            />
            <TextField
              value={comment}
              disabled={shouldHardDelete || stopPlace.hasExpired}
              fullWidth={true}
              floatingLabelText={translations.comment}
              hintText={translations.comment}
              id="terminate-comment"
              onChange={(e, v) => this.setState({ comment: v })}
            />
            <Checkbox
              style={{ marginTop: 5 }}
              checked={shouldTerminatePermanently}
              onCheck={(e, v) =>
                this.setState({ shouldTerminatePermanently: v })
              }
              label={translations.permanentLabel}
            />
            {canDeleteStop && (
              <Checkbox
                style={{ marginTop: 5 }}
                checked={shouldHardDelete}
                onCheck={(e, v) => this.setState({ shouldHardDelete: v })}
                label={translations.deleteLabel}
              />
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
