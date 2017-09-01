import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdDelete from 'material-ui/svg-icons/action/delete';
import MdWarning from 'material-ui/svg-icons/alert/warning';

class RemoveStopFromParentDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { open, intl, handleClose, handleConfirm, stopPlaceId } = this.props;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'delete_stop_title' }),
      info: formatMessage({ id: 'delete_stop_info' }),
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
