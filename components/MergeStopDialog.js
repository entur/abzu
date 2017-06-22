import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
import MdWarning from 'material-ui/svg-icons/alert/warning';

class MergeStopDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const {
      open,
      intl,
      handleClose,
      sourceElement,
      targetElement,
      handleConfirm,
    } = this.props;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'merge_stop_title' }),
      info: formatMessage({ id: 'merge_stop_info' }),
      warning: formatMessage({ id: 'merge_stop_warning' }),
      mergingNotAllowed: formatMessage({ id: 'merging_not_allowed' }),
      error: formatMessage({ id: 'save_dialog_to_is_before_from' }),
    };

    const fromStopPlace = sourceElement
      ? `${sourceElement.name || ''} (${sourceElement.id})`
      : '';
    const toStopPlace = targetElement
      ? `${targetElement.name || ''} (${targetElement.id})`
      : '';
    const canMerge = !!targetElement.id;

    const mergeResultText =  `${fromStopPlace} => ${toStopPlace}`;

    // versionComment should be in Norwegian
    const fromVersionComment = `Flettet ${fromStopPlace} inn i ${toStopPlace}`;
    const toVersionComment = `Flettet ${fromStopPlace} inn i ${toStopPlace}`;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
    ];

    if (canMerge) {
      actions.push(
        <FlatButton
          label={translations.confirm}
          onTouchTap={() => { handleConfirm(fromVersionComment, toVersionComment)}}
          primary={true}
          keyboardFocused={true}
          icon={<MdMerge />}
        />,
      );
    }

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
        {canMerge
          ? <div>
              <div style={{ marginBottom: 20, color: '#000' }}>
                { mergeResultText }
              </div>
              <div style={{ marginLeft: 0 }}>{translations.info}</div>
              <div
                style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}
              >
                <MdWarning color="orange" />
                <span style={{ fontWeight: 600, marginLeft: 5 }}>
                  {translations.warning}
                </span>
              </div>
            </div>
          : <div>{translations.mergingNotAllowed}
            {' '}</div>}
      </Dialog>
    );
  }
}

export default MergeStopDialog;
