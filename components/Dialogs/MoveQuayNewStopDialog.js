import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
import AcceptChanges from '../EditStopPage/AcceptChanges';
import ScrollableQuayList from './ScrollableQuayList';

class MoveQuayNewStopDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
      quayIds: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false,
        quayIds: []
      });
    }
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        changesUnderstood: false,
        quayIds: nextProps.quay ? [nextProps.quay.id] : []
      });
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    fromStopPlaceId: PropTypes.string.isRequired,
    quays: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  handleUpdate(quayIds) {
    this.setState({
      quayIds: quayIds
    });
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      quay,
      quays,
      fromStopPlaceId,
      hasStopBeenModified
    } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood, quayIds } = this.state;
    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    if (!quay) return null;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'move_quay_new_stop_title' }),
      info: formatMessage({ id: 'move_quay_new_stop_info' }),
      result: formatMessage({
        id: quayIds.length > 1
          ? 'move_quay_new_stop_consequence_pl'
          : 'move_quay_new_stop_consequence'
      })
    };

    const fromVersionComment = `Flyttet ${quayIds.join(', ')} til nytt stoppested`;
    const toVersionComment = `Flyttet ${quayIds.join(', ')} fra ${fromStopPlaceId}`;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        disabled={!enableConfirm}
        onTouchTap={() => {
          handleConfirm(quayIds, fromVersionComment, toVersionComment);
        }}
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
        contentStyle={{ width: '30%', minWidth: '30%', margin: 'auto' }}
      >
        <div>
          <div style={{ marginBottom: 10, fontWeight: 600, color: '#000' }}>
            {quayIds.length}{' '}{translations.result}
          </div>
          <ScrollableQuayList
            style={{ marginBottom: 10, color: '#000' }}
            quays={quays}
            handleUpdate={this.handleUpdate.bind(this)}
            defaultQuayId={quay.id}
          />
          <span>{translations.info}</span>
          {hasStopBeenModified &&
            <AcceptChanges
              checked={changesUnderstood}
              onChange={(e, v) => this.setState({ changesUnderstood: v })}
            />}
        </div>
      </Dialog>
    );
  }
}

export default MoveQuayNewStopDialog;
