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

class DeleteStopPlaceDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {

    const { open, intl, handleClose, handleConfirm, stopPlace } = this.props;
    const { formatMessage } = intl;
    const { isChildOfParent } = stopPlace;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'delete_stop_title' }),
      info: formatMessage({ id: 'delete_stop_info' }),
      cannotDelete: formatMessage({id: 'delete_stop_not_allowed'})
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
        disabled={!!isChildOfParent}
        primary={true}
        keyboardFocused={true}
        icon={<MdMerge />}
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
        {
          !isChildOfParent ? (
              <div>
                <div style={{ marginBottom: 10, color: '#000' }}>
                  <span style={{fontWeight: 600}}>{ `${stopPlace.name} (${stopPlace.id})` }</span>
                </div>
                <div style={{ marginLeft: 0, display: 'flex'}} >
                  <div style={{marginTop: 0, marginRight: 5}}>
                    <MdWarning color="orange"/>
                  </div>
                  <span>{translations.info}</span>
                </div>
              </div>
            )
          : <div style={{ marginLeft: 0, display: 'flex', alignItems: 'center'}}>
              <div style={{marginTop: 0, marginRight: 5}}>
                <MdWarning color="#dc2828" style={{width: 35, height: 35}}/>
              </div>
              <span>{translations.cannotDelete}</span>
            </div>
        }
      </Dialog>
    );
  }
}

export default DeleteStopPlaceDialog;
