import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
import Code from './Code';
import AcceptChanges from './AcceptChanges';

class MoveQuayDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false
      });
    }
  }


  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { open, intl, handleClose, handleConfirm, stopPlaceId, quay, hasStopBeenModified } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood } = this.state;
    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    if (!quay) return null;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'move_quay_title' }),
      info: formatMessage({ id: 'move_quay_info' }),
    };

    const fromVersionComment = `Flyttet ${quay.id} til ${stopPlaceId}`;
    const toVersionComment = `Flyttet ${quay.id} til ${stopPlaceId}`;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        disabled={!enableConfirm}
        onTouchTap={() => { handleConfirm(fromVersionComment,toVersionComment) }}
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
          <div style={{ marginBottom: 10, color: '#000' }}>
            <span style={{fontWeight: 600}}>{ `${quay.id} => ${stopPlaceId}` }</span>
            <div style={{display: 'flex', padding: 5, textAlign: 'center', width: '100%'}}>
              <Code type="publicCode" value={quay.publicCode}/>
              <Code type="privateCode" value={quay.privateCode}/>
            </div>
          </div>
          <span>{translations.info}</span>
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

export default MoveQuayDialog;
