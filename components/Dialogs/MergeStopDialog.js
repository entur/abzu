import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MdCancel from 'material-ui/svg-icons/navigation/cancel';
import MdMerge from 'material-ui/svg-icons/editor/merge-type';
import AcceptChanges from './EditStopPage/AcceptChanges';
import QuayDetails from './QuayDetails';

class MergeStopDialog extends React.Component {
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
    intl: PropTypes.object.isRequired
  };

  render() {
    const {
      open,
      intl,
      handleClose,
      sourceElement,
      targetElement,
      handleConfirm,
      hasStopBeenModified
    } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood } = this.state;

    const translations = {
      confirm: formatMessage({ id: 'confirm' }),
      cancel: formatMessage({ id: 'cancel' }),
      title: formatMessage({ id: 'merge_stop_title' }),
      info: formatMessage({ id: 'merge_stop_info' }),
      result: formatMessage({ id: 'merge_stop_new_quays' }),
      result_empty: formatMessage({ id: 'merge_stop_no_new_quays' }),
      mergingNotAllowed: formatMessage({ id: 'merging_not_allowed' }),
      error: formatMessage({ id: 'save_dialog_to_is_before_from' })
    };

    const fromStopPlace = sourceElement
      ? `${sourceElement.name || ''} (${sourceElement.id})`
      : '';
    const toStopPlace = targetElement
      ? `${targetElement.name || ''} (${targetElement.id})`
      : '';
    const canMerge = !!targetElement.id;

    const mergeResultText = `${fromStopPlace} => ${toStopPlace}`;
    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    // versionComment should be in Norwegian

    let numberOfQuaysMerged = 'Ingen quayer flettet';

    if (sourceElement && sourceElement.quays) {
      if (sourceElement.quays.length === 1) {
        numberOfQuaysMerged = 'Én quay flettet.';
      } else if (sourceElement.quays.length > 1) {
        numberOfQuaysMerged = `${sourceElement.quays.length} quayer flettet.`;
      }
    }

    const fromVersionComment = `Flettet ${fromStopPlace} inn i ${toStopPlace}. ${numberOfQuaysMerged}`;
    const toVersionComment = `Flettet ${fromStopPlace} inn i ${toStopPlace}. ${numberOfQuaysMerged}`;

    if (!sourceElement) return null;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onTouchTap={handleClose}
        icon={<MdCancel />}
      />
    ];

    if (canMerge) {
      actions.push(
        <FlatButton
          label={translations.confirm}
          disabled={!enableConfirm}
          onTouchTap={() => {
            handleConfirm(fromVersionComment, toVersionComment);
          }}
          primary={true}
          keyboardFocused={true}
          icon={<MdMerge />}
        />
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
                {mergeResultText}
              </div>
              {sourceElement.quays && sourceElement.quays.length
                ? <span style={{ fontWeight: 600 }}>{translations.result}</span>
                : <span style={{ fontWeight: 600, borderBottom: '1px solid' }}>
                    {translations.result_empty}
                  </span>}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  maxHeight: 300,
                  overflowX: 'scroll',
                  marginBottom: 10
                }}
              >
                {(sourceElement.quays || []).map(quay =>
                  <div style={{ padding: 10 }} key={'quay-details-' + quay.id}>
                    <QuayDetails quay={quay} hideSourceOriginLabel={true} />
                  </div>
                )}
              </div>
              <div style={{ marginLeft: 0 }}>{translations.info}</div>
              {hasStopBeenModified &&
                <AcceptChanges
                  checked={changesUnderstood}
                  onChange={(e, v) => this.setState({ changesUnderstood: v })}
                />}
            </div>
          : <div>{translations.mergingNotAllowed}</div>}
      </Dialog>
    );
  }
}

export default MergeStopDialog;
