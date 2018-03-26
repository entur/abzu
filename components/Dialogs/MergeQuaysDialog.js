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
import MergeQuaysDetails from '../EditStopPage/MergeQuaysDetails';
import AcceptChanges from '../EditStopPage/AcceptChanges';
import Spinner from '../../static/icons/spinner';

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


  getUsageWarning() {
    const { OTPFetchIsLoading, mergeQuayWarning, intl } = this.props;
    const { formatMessage } = intl;
    const infoStyle = { fontSize: '1.1em', borderBottom: 10 };

    if (OTPFetchIsLoading) {
      return (
        <div style={{ ...infoStyle, display: 'flex', alignItems: 'center' }}>
          <Spinner />
          <div style={{ marginLeft: 5 }}>
            {formatMessage({ id: 'checking_quay_usage' })}
          </div>
        </div>
      );
    }


    if (mergeQuayWarning) {
      const { warning, authorities } = mergeQuayWarning;

      if (warning) {
        const panicStyle = {
          color: '#000',
          padding: 10,
          marginBottom: 10,
          border: '1px solid black',
          background: 'rgb(252, 200, 197)'
        };
        return (
          <div style={panicStyle}>
            <div>{formatMessage({ id: 'quay_usages_found' })}</div>
            {
              <div
                style={{
                  fontWeight: 600,
                  marginTop: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: '1.5'
                }}
              >
                <div>
                  {formatMessage({ id: 'important_quay_usages_found' })}
                </div>
                <div style={{ fontStyle: 'italic' }}>
                  {authorities && authorities.join(', ')}
                </div>
              </div>
            }
          </div>
        );
      }
    }
    return null;
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      mergingQuays,
      handleConfirm,
      hasStopBeenModified,
      OTPFetchIsLoading,
      isLoading
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

    const enableConfirm = !hasStopBeenModified || changesUnderstood;

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
        onClick={() => {
          handleConfirm(versionComment);
        }}
        disabled={!enableConfirm || isLoading || OTPFetchIsLoading }
        primary={true}
        keyboardFocused={true}
        icon={isLoading ? <Spinner /> : <MdMerge />}
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
          {this.getUsageWarning()}
          <MergeQuaysDetails merginQuays={mergingQuays} />
          <div style={{ marginLeft: 0, fontSize: 14 }}>{translations.info}</div>
          {hasStopBeenModified && (
            <AcceptChanges
              checked={changesUnderstood}
              onChange={(e, v) => this.setState({ changesUnderstood: v })}
            />
          )}
        </div>
      </Dialog>
    );
  }
}

export default MergeQuaysDialog;
