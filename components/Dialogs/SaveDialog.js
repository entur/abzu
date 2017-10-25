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
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import MdSave from 'material-ui/svg-icons/content/save';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdSpinner from '../../static/icons/spinner';
import { HumanReadableErrorCodes } from '../../models/ErrorCodes';
import areIntlLocalesSupported from 'intl-locales-supported';
import { isDateRangeLegal, getEarliestFromDate } from '../../utils/saveDialogUtils';

let DateTimeFormat;

if (areIntlLocalesSupported(['nb'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/nb');
}

class SaveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.setState(this.getInitialState);
  }

  componentDidMount(){
    if (this.commentInput) {
      this.commentInput.focus();
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleSetToDate(value) {

    const { timeFrom, timeTo } = this.state;

    let newTimeFrom = timeTo
      ? new Date(timeTo.valueOf())
      : new Date(timeFrom.valueOf());

    if (timeTo === null) {
      if (timeTo === null && timeFrom !== null) {
        newTimeFrom = newTimeFrom.setTime(
          timeFrom.getTime() + 1000 * 60
        );
      }
    }

    this.setState({
      dateTo: value,
      timeTo: new Date(newTimeFrom)
    });
  }

  getInitialState() {
    const earliestFrom = getEarliestFromDate(this.props.currentValidBetween);
    return {
      timeFrom: earliestFrom,
      timeTo: null,
      dateFrom: earliestFrom,
      dateTo: null,
      expiraryExpanded: false,
      isSaving: false,
      comment: '',
    };
  }

  getErrorMessage() {
    const { errorMessage, intl } = this.props;
    const { locale } = intl;
    if (errorMessage) {
      return HumanReadableErrorCodes[locale][errorMessage];
    }
    return '';
  }

  handleSave() {
    const { handleConfirm } = this.props;
    const {
      expiraryExpanded,
      timeFrom,
      timeTo,
      dateFrom,
      dateTo,
      comment,
    } = this.state;
    let userInput = {
      dateFrom: dateFrom,
      timeFrom: timeFrom,
      comment: comment,
    };
    if (expiraryExpanded) {
      userInput.dateTo = dateTo;
      userInput.timeTo = timeTo;
    }

    this.setState({
      isSaving: true,
    });

    handleConfirm(userInput);
  }

  render() {
    const { open, intl, handleClose, errorMessage, currentValidBetween } = this.props;
    const { formatMessage } = intl;
    const {
      timeFrom,
      timeTo,
      dateFrom,
      dateTo,
      expiraryExpanded,
      isSaving,
      comment,
    } = this.state;

    const errorMessageLabel = this.getErrorMessage();

    const earliestFrom = getEarliestFromDate(currentValidBetween);

    const translations = {
      use: formatMessage({ id: 'use' }),
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      date: formatMessage({ id: 'date' }),
      time: formatMessage({ id: 'time' }),
      title: formatMessage({ id: 'save_dialog_title' }),
      message_from: formatMessage({ id: 'save_dialog_message_from' }),
      message_to: formatMessage({ id: 'save_dialog_message_to' }),
      note: formatMessage({ id: 'save_dialog_note' }),
      error: formatMessage({ id: 'save_dialog_to_is_before_from' }),
      do_you_want_to_specify_expirary: formatMessage({
        id: 'do_you_want_to_specify_expirary',
      }),
      comment: formatMessage({ id: 'comment' }),
    };

    const {
      timeLegal,
      dateLegal
    } = isDateRangeLegal(dateTo, dateFrom, expiraryExpanded, timeFrom, timeTo);

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        primary={true}
        keyboardFocused={true}
        icon={isSaving && !errorMessage.length ? <MdSpinner /> : <MdSave />}
        disabled={!timeLegal || !dateLegal || isSaving}
        onTouchTap={() => this.handleSave()}
      />,
    ];

    return (
      <Dialog
        title={translations.title}
        actions={actions}
        modal={true}
        open={open}
        onRequestClose={() => {
          handleClose();
        }}
        contentStyle={{ width: '40%', minWidth: '40%', margin: 'auto' }}
      >
        <div style={{ marginLeft: 30 }}>{translations.message_from}</div>
        <div style={{ marginTop: 15, textAlign: 'center' }}>
          <DatePicker
            hintText={translations.date}
            cancelLabel={translations.cancel}
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
            value={dateFrom}
            textFieldStyle={{ width: '80%' }}
            onChange={(event, value) => {
              this.setState({ dateFrom: value });
            }}
          />
          <TimePicker
            format="24hr"
            cancelLabel={translations.cancel}
            hintText={translations.time}
            value={timeFrom}
            okLabel={translations.use}
            autoOk
            textFieldStyle={{ width: '80%' }}
            onChange={(event, value) => {
              this.setState({
                timeFrom: new Date(new Date(value).setSeconds(0)),
              });
            }}
          />
        </div>
        <div style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
          {translations.note}
        </div>
        <Checkbox
          checked={expiraryExpanded}
          label={translations.do_you_want_to_specify_expirary}
          onCheck={(event, checked) => {
            this.setState({ expiraryExpanded: checked });
          }}
          style={{ marginTop: 10, fontSize: 12 }}
        />
        {expiraryExpanded
          ? <div>
              <div style={{ marginTop: 20, marginLeft: 30 }}>
                {translations.message_to}
              </div>
              <div style={{ marginTop: 15, textAlign: 'center' }}>
                <DatePicker
                  hintText={translations.date}
                  cancelLabel={translations.cancel}
                  okLabel={translations.use}
                  DateTimeFormat={DateTimeFormat}
                  formatDate={new DateTimeFormat(intl.locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format}
                  autoOk
                  mode="landscape"
                  minDate={dateFrom ? new Date(dateFrom) : earliestFrom}
                  value={dateTo}
                  textFieldStyle={{
                    width: '80%',
                    border: !dateLegal
                      ? '1px solid #ff0d0d'
                      : 'none',
                  }}
                  onChange={(event, value) => {
                    this.handleSetToDate(value);
                  }}
                />
                <div style={{ fontSize: 10, color: 'rgb(244, 67, 54)' }}>
                  {!dateLegal ? translations.error : ''}
                </div>
                <TimePicker
                  format="24hr"
                  cancelLabel={translations.cancel}
                  hintText={translations.time}
                  value={timeTo}
                  okLabel={translations.use}
                  textFieldStyle={{
                    width: '80%',
                    border: !timeLegal
                      ? '1px solid #ff0d0d'
                      : 'none',
                  }}
                  onChange={(event, value) => {
                    this.setState({
                      timeTo: new Date(new Date(value).setSeconds(0)),
                    });
                  }}
                />
                <div style={{ fontSize: 10, color: 'rgb(244, 67, 54)' }}>
                  {!timeLegal ? translations.error : ''}
                </div>
              </div>
            </div>
          : null}
        <div style={{ width: '90%', margin: 'auto', marginBottom: 20 }}>
          <TextField
            floatingLabelText={translations.comment}
            ref={(input) => { this.commentInput = input; }}
            fullWidth={true}
            multiLine={true}
            value={comment}
            onChange={(e, value) => this.setState({ comment: value })}
            rowsMax={4}
          />
        </div>
        <div style={{ color: '#bb271c' }}>{errorMessageLabel}</div>
      </Dialog>
    );
  }
}

export default SaveDialog;
