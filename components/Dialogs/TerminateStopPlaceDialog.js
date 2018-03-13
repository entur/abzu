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

import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdDelete from 'material-ui/svg-icons/action/delete';
import MdDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import Checkbox from 'material-ui/Checkbox';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import { getEarliestFromDate } from '../../utils/saveDialogUtils';
import areIntlLocalesSupported from 'intl-locales-supported';
import TextField from 'material-ui/TextField';
import helpers from '../../modelUtils/mapToQueryVariables';
import Spinner from '../../static/icons/spinner';

let DateTimeFormat;

if (areIntlLocalesSupported(['nb'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/nb');
}

class TerminateStopPlaceDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    warningInfo: PropTypes.object,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  getConfirmIsDisabled() {
    const { stopPlace, isLoading } = this.props;
    const { isChildOfParent, hasExpired } = stopPlace;
    const { shouldHardDelete } = this.state;
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
        latestActiveDate
      } = warningInfo;
      const infoStyle = { fontSize: '1.1em' };
      const alertStyle = { ...infoStyle, color: '#cc0000' };

      if (loading) {
        return (
          <div style={infoStyle}>
            {formatMessage({ id: 'checking_stop_place_usage' })}
          </div>
        );
      }

      if (error) {
        return (
          <div style={alertStyle}>
            {formatMessage({ id: 'failed_checking_stop_place_usage' })}
          </div>
        );
      }

      if (
        warning &&
        stopPlaceId === stopPlace.id &&
        (stopPlace && stopPlace.id)
      ) {
        const makeSomeNoise = activeDatesSize && latestActiveDate > date;
        const panicStyle = {
          color: '#000',
          padding: 10,
          border: '1px solid black',
          background: 'rgb(252, 200, 197)'
        };
        const wrapperStyle = !makeSomeNoise ? alertStyle : panicStyle;
        return (
          <div style={wrapperStyle}>
            <div>
              {formatMessage({ id: 'stop_place_usages_found' })}
            </div>
            {makeSomeNoise && (
              <div style={{ fontWeight: 600, marginTop: 5 }}>
                {formatMessage({ id: 'important_stop_place_usages_found' })}
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
      this.props.serverTimeDiff
    );
    return {
      shouldHardDelete: false,
      date: earliestFrom,
      time: earliestFrom,
      comment: ''
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
      serverTimeDiff
    } = this.props;
    const { formatMessage } = intl;
    const { shouldHardDelete, date, time, comment } = this.state;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'terminate_stop_title' }),
      deleteLabel: formatMessage({ id: 'delete_stop_place' }),
      delete_warning: formatMessage({ id: 'delete_stop_info' }),
      cannotDelete: formatMessage({ id: 'delete_stop_not_allowed' }),
      comment: formatMessage({ id: 'comment' }),
      date: formatMessage({ id: 'date' }),
      time: formatMessage({ id: 'time' })
    };

    const dateTime = helpers.getFullUTCString(time, date);
    const warningUsage = this.getUsageWarning();

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onTouchTap={() => handleConfirm(shouldHardDelete, comment, dateTime)}
        disabled={this.getConfirmIsDisabled()}
        primary={true}
        keyboardFocused={true}
        icon={
          isLoading ? (
            <Spinner />
          ) : shouldHardDelete ? (
            <MdDeleteForever />
          ) : (
            <MdDelete />
          )
        }
      />
    ];

    const earliestFrom = getEarliestFromDate(
      previousValidBetween,
      serverTimeDiff
    );

    return (
      <Dialog
        title={translations.title}
        actions={actions}
        modal={true}
        open={open}
        titleStyle={{ padding: '24px 24px 0px' }}
        onRequestClose={() => {
          handleClose();
        }}
        contentStyle={{ width: '40%', minWidth: '40%', margin: 'auto' }}
      >
        <div>
          <div style={{ marginBottom: 10, color: '#000' }}>
            <span style={{ fontWeight: 600 }}>{`${stopPlace.name} (${
              stopPlace.id
            })`}</span>
          </div>
          <div style={{ color: '#bb271c' }}>
            {stopPlace.hasExpired &&
              formatMessage({ id: 'expired_can_only_be_deleted' })}
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
                day: 'numeric',
                month: 'long',
                year: 'numeric'
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
                time: value
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
          {canDeleteStop && (
            <Checkbox
              style={{ marginTop: 5 }}
              checked={shouldHardDelete}
              onCheck={(e, v) => this.setState({ shouldHardDelete: v })}
              label={translations.deleteLabel}
            />
          )}
          {shouldHardDelete && (
            <div style={{ marginLeft: 10, display: 'flex', marginTop: 10 }}>
              <div style={{ marginTop: 0, marginRight: 5 }}>
                <MdWarning color="orange" />
              </div>
              <span>{translations.delete_warning}</span>
            </div>
          )}
        </div>
      </Dialog>
    );
  }
}

export default TerminateStopPlaceDialog;
