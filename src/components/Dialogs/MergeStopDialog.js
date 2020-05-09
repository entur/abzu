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
import AcceptChanges from '../EditStopPage/AcceptChanges';
import QuayDetails from '../EditStopPage/QuayDetails';
import Spinner from '../../static/icons/spinner';

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
      hasStopBeenModified,
      isLoading,
      isFetchingQuays
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
      error: formatMessage({ id: 'save_dialog_to_is_before_from' }),
      noMergedQuay: formatMessage({id: 'no_merged_quay'}),
      oneMergeQuay: formatMessage({id: 'one_merged_quay'}),
      mergedQuays: formatMessage({id: 'merged_quays'}),
      merged: formatMessage({id: 'merged'}),
      in: formatMessage({id: 'in'})
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

    let quaysMergedLabel = translations.noMergedQuay;

    if (sourceElement && sourceElement.quays) {
      if (sourceElement.quays.length === 1) {
        quaysMergedLabel = translations.oneMergeQuay
      } else if (sourceElement.quays.length > 1) {
        quaysMergedLabel = sourceElement.quays.length + ' ' + translations.mergedQuays;
      }
    }
    const fromVersionComment = translations.merged + ' ' + fromStopPlace + ' ' + translations.in + ' ' + toStopPlace + '. ' + quaysMergedLabel;
    const toVersionComment = translations.merged + ' ' + fromStopPlace + ' ' + translations.in + ' ' + toStopPlace + '. ' + quaysMergedLabel;


      if (!sourceElement) return null;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onClick={handleClose}
        icon={<MdCancel />}
      />
    ];

    if (canMerge) {
      actions.push(
        <FlatButton
          label={translations.confirm}
          disabled={!enableConfirm || isLoading || isFetchingQuays}
          onClick={() => {
            handleConfirm(fromVersionComment, toVersionComment);
          }}
          primary={true}
          keyboardFocused={true}
          icon={isLoading ? <Spinner/> : <MdMerge />}
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
          ? (
            isFetchingQuays
              ? <div style={{textAlign: 'center'}}>
                  <Spinner style={{height: 40, width: 40}}/>
                </div>
              :
              <div>
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
                    overflowX: 'auto',
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
          )
          : <div>{translations.mergingNotAllowed}</div>}
      </Dialog>
    );
  }
}

export default MergeStopDialog;
