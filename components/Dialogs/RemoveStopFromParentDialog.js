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

class RemoveStopFromParentDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { open = false, intl, handleClose, handleConfirm, stopPlaceId } = this.props;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'remove_stop_from_parent_title' }),
      info: formatMessage({ id: 'remove_stop_from_parent_info' }),
    };

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onTouchTap={handleConfirm}
        primary={true}
        keyboardFocused={true}
        icon={<MdDelete />}
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
        <div>
          <div style={{ marginBottom: 10, color: '#000' }}>
            <span style={{fontWeight: 600}}>{stopPlaceId}</span>
          </div>
          <div style={{ marginLeft: 0, display: 'flex'}} >
            <div style={{marginTop: 0, marginRight: 5}}>
              <MdWarning color="orange"/>
            </div>
            <span>{translations.info}</span>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default RemoveStopFromParentDialog;
