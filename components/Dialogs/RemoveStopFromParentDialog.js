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
import MdWarning from 'material-ui/svg-icons/alert/warning';
import Checkbox from 'material-ui/Checkbox';
import Spinner from '../../static/icons/spinner';

class RemoveStopFromParentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  getConfirmDisabled() {
    const { changesUnderstood, isLoading } = this.state;

    if (isLoading) return true;

    const { isLastChild } = this.props;
    if (isLastChild) {
      if (changesUnderstood) {
        return false;
      }
      return true;
    }
    return false;
  }


  render() {
    const {
      open = false,
      intl,
      handleClose,
      handleConfirm,
      stopPlaceId,
      isLastChild,
      isLoading
    } = this.props;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'remove_stop_from_parent_title' }),
      info: formatMessage({ id: 'remove_stop_from_parent_info' }),
      understood: formatMessage({id: 'changes_understood'}),
      lastChildWarning1: formatMessage({id: 'last_child_warning_first'}),
      lastChildWarning2: formatMessage({id: 'last_child_warning_second'}),
    };

    const { changesUnderstood } = this.state;
    const confirmDisabled = this.getConfirmDisabled();

    let actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onClick={handleConfirm}
        disabled={confirmDisabled}
        primary={true}
        keyboardFocused={true}
        icon={isLoading ? <Spinner/> : <MdDelete/>}
      />
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
        <div>
          <div style={{ marginBottom: 10, color: '#000' }}>
            <span style={{ fontWeight: 600 }}>{stopPlaceId}</span>
          </div>
          <div style={{ marginLeft: 0, display: 'flex' }}>
            <div style={{ marginTop: 0, marginRight: 5 }}>
              <MdWarning color="orange" />
            </div>
            <span>{translations.info}</span>
          </div>
          {isLastChild &&
            <div style={{ marginTop: 10 }}>
              <div style={{ marginLeft: 0, display: 'flex' }}>
                <div style={{ marginTop: 0, marginRight: 5 }}>
                  <MdWarning color="#de3e35" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span>
                    {translations.lastChildWarning1}
                  </span>
                  <span style={{marginTop: 5}}>
                    {translations.lastChildWarning2}
                  </span>
                </div>
              </div>
              <Checkbox
                style={{ marginLeft: 25, marginTop: 5 }}
                label={translations.understood}
                onCheck={(e, v) => this.setState({ changesUnderstood: v })}
                checked={changesUnderstood}
              />
            </div>}
        </div>
      </Dialog>
    );
  }
}

export default RemoveStopFromParentDialog;
