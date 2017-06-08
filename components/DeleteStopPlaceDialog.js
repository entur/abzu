import React, { PropTypes } from 'react';
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

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'delete_stop_title' }),
      info: formatMessage({ id: 'delete_stop_info' }),
      warning: formatMessage({ id: 'delete_stop_warning' }),
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
        <div>
          <div style={{ marginBottom: 20, color: '#000' }}>
            <span style={{fontWeight: 600}}>{ `${stopPlace.name} (${stopPlace.id})` }</span>
          </div>
          <div style={{ marginLeft: 0 }}>{translations.info}</div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
            <MdWarning color="orange" />
            <span style={{ fontWeight: 600, marginLeft: 5 }}>
              {translations.warning}
            </span>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DeleteStopPlaceDialog;
