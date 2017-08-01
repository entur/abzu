import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
import MergeQuaysDetails from '../EditStopPage/MergeQuaysDetails';
import AcceptChanges from '../EditStopPage/AcceptChanges';

class MergeQuaysDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false
      });
    }
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      mergingQuays,
      handleConfirm,
      hasStopBeenModified
    } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood } = this.state;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'merge_quays_title' }),
      info: formatMessage({ id: 'merge_quays_info' }),
      warning: formatMessage({ id: 'merge_quays_warning' })
    };

    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    const fromQuay = mergingQuays.fromQuay ? mergingQuays.fromQuay.id : '';
    const toQuay = mergingQuays.toQuay ? mergingQuays.toQuay.id : '';

    const versionComment = `Flettet quay ${fromQuay} til ${toQuay}`;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onTouchTap={() => {
          handleConfirm(versionComment);
        }}
        disabled={!enableConfirm}
        primary={true}
        keyboardFocused={true}
        icon={<MdMerge />}
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
          <MergeQuaysDetails merginQuays={mergingQuays} />
          <div style={{ marginLeft: 0, fontSize: 14 }}>{translations.info}</div>
          {hasStopBeenModified &&
            <AcceptChanges
              checked={changesUnderstood}
              onChange={(e, v) => this.setState({ changesUnderstood: v })}
            />
           }
        </div>
      </Dialog>
    );
  }
}

export default MergeQuaysDialog;
