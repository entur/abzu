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
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
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
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState(this.getInitialState(nextProps));
    }
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

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

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
    const { isChildOfParent } = stopPlace;
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

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onTouchTap={() => handleConfirm(shouldHardDelete, comment, dateTime)}
        disabled={!!isChildOfParent || isLoading}
        primary={true}
        keyboardFocused={true}
        icon={isLoading ? <Spinner /> : <MdMerge />}
      />
    ];

    const earliestFrom = getEarliestFromDate(previousValidBetween, serverTimeDiff);

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
            <span
              style={{ fontWeight: 600 }}
            >{`${stopPlace.name} (${stopPlace.id})`}</span>
          </div>
          <DatePicker
            hintText={translations.date}
            disabled={shouldHardDelete}
            cancelLabel={translations.cancel}
            floatingLabelText={translations.date}
            okLabel={translations.use}
            DateTimeFormat={DateTimeFormat}
            formatDate={new DateTimeFormat(intl.locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format}
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
            disabled={shouldHardDelete}
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
            disabled={shouldHardDelete}
            fullWidth={true}
            floatingLabelText={translations.comment}
            hintText={translations.comment}
            id="terminate-comment"
            onChange={(e, v) => this.setState({ comment: v })}
          />
          {canDeleteStop &&
            <Checkbox
              style={{ marginTop: 5 }}
              checked={shouldHardDelete}
              onCheck={(e, v) => this.setState({ shouldHardDelete: v })}
              label={translations.deleteLabel}
            />}
          {shouldHardDelete &&
            <div style={{ marginLeft: 10, display: 'flex', marginTop: 10 }}>
              <div style={{ marginTop: 0, marginRight: 5 }}>
                <MdWarning color="orange" />
              </div>
              <span>{translations.delete_warning}</span>
            </div>}
        </div>
      </Dialog>
    );
  }
}

export default TerminateStopPlaceDialog;
