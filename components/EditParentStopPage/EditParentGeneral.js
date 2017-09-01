import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import ParentStopDetails from './ParentStopDetails';
import MdBack from 'material-ui/svg-icons/navigation/arrow-back';
import VersionsPopover from '../EditStopPage/VersionsPopover';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import { StopPlaceActions, UserActions } from '../../actions/';
import SaveDialog from '../Dialogs/SaveDialog';
import { withApollo } from 'react-apollo';
import mapToMutationVariables from '../../modelUtils/mapToQueryVariables';
import { saveParentStopPlace, getStopPlaceVersions, createParentStopPlace } from '../../graphql/Actions';
import * as types from '../../actions/Types';
import { MutationErrorCodes } from '../../models/ErrorCodes';
import { stopPlaceAndPathLinkByVersion } from '../../graphql/Queries';

class EditParentGeneral extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmUndoOpen: false,
      saveDialogOpen: false,
      errorMessage: '',
    }
  }

  getTitleText = (stopPlace, formatMessage) => {
    return stopPlace && stopPlace.id
      ? `${stopPlace.name}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
      : formatMessage({ id: 'new_stop_title' });
  };

  handleLoadVersion({id, version}) {
    const { client } = this.props;
    client.query({
      fetchPolicy: 'network-only',
      query: stopPlaceAndPathLinkByVersion,
      variables: {
        id,
        version
      }
    });
  }

  handleSaveSuccess(stopPlaceId) {
    const { client, dispatch } = this.props;

    this.setState({
      saveDialogOpen: false
    });

    getStopPlaceVersions(client, stopPlaceId).then(() => {
      dispatch(UserActions.navigateTo('/edit/', stopPlaceId));
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS)
      );
    });
  }

  handleSaveError(errorCode) {
    this.props.dispatch(
      UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED, types.ERROR)
    );
    this.setState({
      errorMessage: errorCode
    });
  }

  handleSave() {
    this.setState({
      saveDialogOpen: true,
      errorMessage: ''
    });
  }

  handleDiscardChanges() {
    this.setState({
      confirmUndoOpen: false
    });
    this.props.dispatch(StopPlaceActions.discardChangesForEditingStop());
  }

  handleCreateNewParentStopPlace(stopPlaceIds) {
    const { client, stopPlace } = this.props;
    createParentStopPlace(client, stopPlace.name, stopPlaceIds).then( ({data}) => {
      if (data && data.createMultiModalStopPlace && data.createMultiModalStopPlace.length) {
        const parentStopPlaceId = data.createMultiModalStopPlace[0].id;
        this.handleSaveSuccess(parentStopPlaceId);
      }
    }).then( err => {
      this.handleSaveError(MutationErrorCodes.ERROR_STOP_PLACE);
    });
  }

  saveParentStop(userInput) {
    const { client, stopPlace } = this.props;
    const parentStopPlaceVariables = mapToMutationVariables.mapParentStopToVariables(
      stopPlace,
      userInput
    );

    saveParentStopPlace(client, parentStopPlaceVariables).then(
      ({data}) => {
        if (data && data.mutateParentStopPlace && data.mutateParentStopPlace.length) {
          const parentStopPlaceId = data.mutateParentStopPlace[0].id;
          this.handleSaveSuccess(parentStopPlaceId);
        }
      }
    ).catch( err => {
      this.handleSaveError(MutationErrorCodes.ERROR_STOP_PLACE);
    });

  }

  render() {

    const { stopPlace, versions, intl, stopHasBeenModified, disabled } = this.props;
    const { formatMessage } = intl;

    const containerStyle = {
      border: '1px solid #511E12',
      background: '#fff',
      width: 405,
      marginTop: 1,
      position: 'absolute',
      zIndex: 999,
      marginLeft: 2,
      height: 'auto'
    };

    const stopBoxBar = {
      color: '#fff',
      background: 'rgb(39, 58, 70)',
      fontSize: 12,
      padding: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    const stopPlaceLabel = this.getTitleText(stopPlace, formatMessage);

    return (
      <div style={containerStyle}>
        <div style={stopBoxBar}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <MdBack
              color="#fff"
              style={{
                cursor: 'pointer',
                marginRight: 2,
                transform: 'scale(0.8)'
              }}
              onClick={() => {}}
            />
            <div>{stopPlaceLabel}</div>
          </div>
          <VersionsPopover
            versions={versions || []}
            buttonLabel={formatMessage({id: 'versions'})}
            disabled={!versions.length}
            handleSelect={this.handleLoadVersion.bind(this)}
          />
        </div>
        <ParentStopDetails
          handleCreateNewParentStopPlace={this.handleCreateNewParentStopPlace.bind(this)}
        />
        <div
          style={{
            border: '1px solid #efeeef',
            textAlign: 'right',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <FlatButton
            icon={<MdUndo />}
            disabled={!stopHasBeenModified}
            label={formatMessage({ id: 'undo_changes' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.8em' }}
            onClick={() => {
              this.setState({ confirmUndoOpen: true });
            }}
          />
          <FlatButton
            icon={<MdSave />}
            disabled={disabled || !stopHasBeenModified || !stopPlace.name.length || !stopPlace.id }
            label={formatMessage({ id: 'save_new_version' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.8em' }}
            onClick={this.handleSave.bind(this)}
          />
        </div>
        <ConfirmDialog
          open={this.state.confirmUndoOpen}
          handleClose={() => {
            this.setState({confirmUndoOpen: false})
          }}
          handleConfirm={() => {
            this.handleDiscardChanges();
          }}
          messagesById={{
            title: 'discard_changes_title',
            body: 'discard_changes_body',
            confirm: 'discard_changes_confirm',
            cancel: 'discard_changes_cancel'
          }}
          intl={intl}
        />
        {this.state.saveDialogOpen && !disabled
          ? <SaveDialog
            open={this.state.saveDialogOpen}
            handleClose={() => {
              this.setState({saveDialogOpen: false})
            }}
            handleConfirm={this.saveParentStop.bind(this)}
            errorMessage={this.state.errorMessage}
            intl={intl}
          />
          : null}
      </div>
    )
  }
}

const mapStateToProps = ({stopPlace}) => ({
  stopPlace: stopPlace.current,
  versions: stopPlace.versions,
  stopHasBeenModified: stopPlace.stopHasBeenModified
});

export default withApollo(injectIntl(connect(mapStateToProps)(EditParentGeneral)));