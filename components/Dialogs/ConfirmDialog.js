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

class ConfirmDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    messagesById: PropTypes.object.isRequired,
  };

  render() {
    const { open, handleClose, handleConfirm, intl, messagesById } = this.props;
    const { formatMessage } = intl;

    const confirmDialogTranslation = {
      title: formatMessage({ id: messagesById.title }),
      body: formatMessage({ id: messagesById.body }),
      confirm: formatMessage({ id: messagesById.confirm }),
      cancel: formatMessage({ id: messagesById.cancel }),
    };

    const actions = [
      <FlatButton
        label={confirmDialogTranslation.cancel}
        primary={true}
        onClick={handleClose}
      />,
      <FlatButton
        label={confirmDialogTranslation.confirm}
        primary={true}
        keyboardFocused={true}
        onClick={handleConfirm}
      />,
    ];

    return (
      <div>
        <Dialog
          title={confirmDialogTranslation.title}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={() => {
            handleClose();
          }}
        >
          {confirmDialogTranslation.body}
        </Dialog>
      </div>
    );
  }
}

export default ConfirmDialog;
