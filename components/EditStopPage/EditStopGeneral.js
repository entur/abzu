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


import { connect } from 'react-redux';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { StopPlaceActions, UserActions } from '../../actions/';
import stopTypes from '../../models/stopTypes';
import { injectIntl } from 'react-intl';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import EditStopBoxTabs from './EditStopBoxTabs';
import { Tabs, Tab } from 'material-ui/Tabs';
import StopPlaceDetails from './StopPlaceDetails';
import { withApollo } from 'react-apollo';
import mapToMutationVariables from '../../modelUtils/mapToQueryVariables';
import { mutatePathLink, mutateParking } from '../../graphql/Mutations';
import { stopPlaceAndPathLinkByVersion } from '../../graphql/Queries';
import * as types from '../../actions/Types';
import EditStopAdditional from './EditStopAdditional';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import MdBack from 'material-ui/svg-icons/navigation/arrow-back';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import Divider from 'material-ui/Divider';
import SaveDialog from '../Dialogs/SaveDialog';
import MergeStopDialog from '../Dialogs/MergeStopDialog';
import MergeQuaysDialog from '../Dialogs/MergeQuaysDialog';
import { MutationErrorCodes } from '../../models/ErrorCodes';
import DeleteQuayDialog from '../Dialogs/DeleteQuayDialog';
import {
  deleteQuay,
  getStopPlaceVersions,
  deleteStopPlace,
  mergeQuays,
  getStopPlaceWithAll,
  mergeAllQuaysFromStop,
  moveQuaysToStop,
  getNeighbourStops,
  moveQuaysToNewStop,
  saveStopPlaceBasedOnType,
  terminateStop
} from '../../graphql/Actions';
import TerminateStopPlaceDialog from '../Dialogs/TerminateStopPlaceDialog';
import MoveQuayDialog from '../Dialogs/MoveQuayDialog';
import MoveQuayNewStopDialog from '../Dialogs/MoveQuayNewStopDialog';
import Settings from '../../singletons/SettingsManager';
import { getIn, getIsCurrentVersionMax } from '../../utils/';
import VersionsPopover from './VersionsPopover';
import RequiredFieldsMissingDialog from '../Dialogs/RequiredFieldsMissingDialog';
import Routes from '../../routes/';


class EditStopGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmUndoOpen: false,
      confirmGoBack: false,
      saveDialogOpen: false,
      errorMessage: '',
      requiredFieldsMissingOpen: false,
      isLoading: false,
    };
  }

  handleSave() {
    const { stopPlace } = this.props;
    if (!stopPlace.name || !stopPlace.name.trim().length || !stopPlace.stopPlaceType) {
      this.setState({
        requiredFieldsMissingOpen: true
      });
    } else {
      this.setState({
        saveDialogOpen: true,
        errorMessage: ''
      });
    }
  }

  handleCloseMergeStopDialog() {
    this.props.dispatch(UserActions.hideMergeStopDialog());
  }

  handleCloseMergeQuaysDialog() {
    this.props.dispatch(UserActions.hideMergeQuaysDialog());
  }

  handleCloseDeleteQuay() {
    this.props.dispatch(UserActions.hideDeleteQuayDialog());
  }

  handleCloseDeleteStop() {
    this.props.dispatch(UserActions.hideDeleteStopDialog());
  }

  handleCloseMoveQuay() {
    this.props.dispatch(UserActions.closeMoveQuayDialog());
  }

  handleCloseMoveQuayNewStop() {
    this.props.dispatch(UserActions.closeMoveQuayToNewStopDialog());
  }

  handleSaveSuccess(stopPlaceId) {
    const { client, dispatch } = this.props;

    this.setState({
      saveDialogOpen: false
    });

    getStopPlaceVersions(client, stopPlaceId).then(() => {
      dispatch(UserActions.navigateTo(`/${Routes.STOP_PLACE}/`, stopPlaceId));
      dispatch(
        UserActions.openSnackbar(types.SUCCESS)
      );
    });
  }

  handleSaveError(errorCode) {
    this.setState({
      errorMessage: errorCode
    });
  }

  handleMergeQuaysFromStop(fromVersionComment, toVersionComment) {
    const { stopPlace, mergeSource, client, dispatch, activeMap } = this.props;
    this.setState({isLoading: true});

    mergeAllQuaysFromStop(
      client,
      mergeSource.id,
      stopPlace.id,
      fromVersionComment,
      toVersionComment
    )
      .then(result => {
        dispatch(
          UserActions.openSnackbar(types.SUCCESS)
        );
        this.handleCloseMergeStopDialog();
        getStopPlaceWithAll(client, stopPlace.id).then(() => {
          this.setState({isLoading: false});
          if (activeMap) {
            let includeExpired = new Settings().getShowExpiredStops();
            getNeighbourStops(
              client,
              stopPlace.id,
              activeMap.getBounds(),
              includeExpired
            );
          }
        });
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  }

  handleMergeQuays(versionComment) {
    const { mergingQuay, client, stopPlace, dispatch } = this.props;

    this.setState({isLoading: true});

    mergeQuays(
      client,
      stopPlace.id,
      mergingQuay.fromQuay.id,
      mergingQuay.toQuay.id,
      versionComment
    )
      .then(result => {
        this.setState({isLoading: false});
        dispatch(
          UserActions.openSnackbar(types.SUCCESS)
        );
        this.handleCloseMergeQuaysDialog();
        getStopPlaceWithAll(client, stopPlace.id);
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  }

  handleDeleteQuay() {
    const { client, deletingQuay, dispatch, stopPlace } = this.props;
    this.setState({isLoading: true});
    deleteQuay(client, deletingQuay)
      .then(response => {
        this.setState({isLoading: false});
        dispatch(UserActions.hideDeleteQuayDialog());
        getStopPlaceWithAll(client, stopPlace.id).then(response => {
          dispatch(UserActions.openSnackbar(types.SUCCESS));
        });
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  }

  handleMoveQuay(fromVersionComment, toVersionComment) {
    const { client, movingQuay, dispatch, stopPlace } = this.props;
    this.setState({isLoading: true});
    moveQuaysToStop(
      client,
      stopPlace.id,
      movingQuay.id,
      fromVersionComment,
      toVersionComment
    )
      .then(response => {
        this.setState({isLoading: false});
        dispatch(UserActions.closeMoveQuayDialog());
        dispatch(
          UserActions.openSnackbar(types.SUCCESS)
        );
        getStopPlaceWithAll(client, stopPlace.id);
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  }

  handleTerminateStop(shouldHardDelete, comment, dateTime) {
    const { client, stopPlace, dispatch } = this.props;
    this.setState({isLoading: true});

    if (shouldHardDelete) {
      deleteStopPlace(client, stopPlace.id)
        .then(response => {
          this.setState({isLoading: false});
          dispatch(UserActions.hideDeleteStopDialog());
          if (response.data.deleteStopPlace) {
            dispatch(UserActions.navigateToMainAfterDelete());
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          dispatch(UserActions.hideDeleteStopDialog(true));
        });
    } else {
      terminateStop(client, stopPlace.id, comment, dateTime).then( result => {
        this.setState({isLoading: false});
        this.handleSaveSuccess(stopPlace.id);
        this.handleCloseDeleteStop();
      }).catch(err => {
        this.setState({isLoading: false});
      })
    }
  }

  handleSaveAllEntities(userInput) {
    const { stopPlace, pathLink, originalPathLink } = this.props;

    const shouldMutateParking = !!(
      stopPlace.parking && stopPlace.parking.length
    );

    const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(
      pathLink
    );

    const shouldMutatePathLinks = (
      pathLinkVariables.length &&
      JSON.stringify(pathLink) !== JSON.stringify(originalPathLink)
    );

    let id = null;

    const { client } = this.props;

    saveStopPlaceBasedOnType(client, stopPlace, userInput)
      .then(resultId => {
        id = resultId;
        if (!shouldMutateParking && !shouldMutatePathLinks) {
          this.handleSaveSuccess(id);
        } else {
          const parkingVariables = mapToMutationVariables.mapParkingToVariables(
            stopPlace.parking,
            stopPlace.id || id
          );

          if (shouldMutatePathLinks) {
            client
              .mutate({
                variables: { PathLink: pathLinkVariables },
                mutation: mutatePathLink
              })
              .then(() => {
                if (shouldMutateParking) {
                  client
                    .mutate({
                      variables: { Parking: parkingVariables },
                      mutation: mutateParking
                    })
                    .then(result => {
                      this.handleSaveSuccess(id);
                    })
                    .catch(err => {
                      this.handleSaveError(MutationErrorCodes.ERROR_PARKING);
                    });
                } else {
                  this.handleSaveSuccess(id);
                }
              })
              .catch(err => {
                this.handleSaveError(MutationErrorCodes.ERROR_PATH_LINKS);
              });
          } else if (shouldMutateParking) {
            client
              .mutate({
                variables: { Parking: parkingVariables },
                mutation: mutateParking
              })
              .then(result => {
                this.handleSaveSuccess(id);
              })
              .catch(err => {
                this.handleSaveError(MutationErrorCodes.ERROR_PARKING);
              });
          }
        }
      })
      .catch(err => {
        this.handleSaveError(MutationErrorCodes.ERROR_STOP_PLACE);
      });
  }

  handleGoBack() {
    this.setState({
      confirmGoBack: false
    });
    this.props.dispatch(UserActions.navigateTo('/', ''));
  }

  handleAllowUserToGoBack() {
    if (this.props.stopHasBeenModified) {
      this.setState({
        confirmGoBack: true
      });
    } else {
      this.handleGoBack();
    }
  }

  handleDiscardChanges() {
    this.setState({
      confirmUndoOpen: false
    });
    this.props.dispatch(StopPlaceActions.discardChangesForEditingStop());
  }

  handleSlideChange(value) {
    this.props.dispatch(UserActions.changeElementTypeTab(value));
  }

  showMoreStopPlace() {
    this.props.dispatch(UserActions.showEditStopAdditional());
  }

  showLessStopPlace = () => {
    this.props.dispatch(UserActions.hideEditStopAdditional());
  };

  handleDialogClose(dialog) {
    this.setState({
      [dialog]: false,
      allowPathLinkAdjustmentsDialog: false,
      saveDialogOpen: false
    });
  }

  handleMoveQuaysNewStop(quayIds, fromVersionComment, toVersionComment) {
    const { client, dispatch, stopPlace } = this.props;
    let newStopPlaceId = null;

    this.setState({isLoading: true});

    moveQuaysToNewStop(client, quayIds, fromVersionComment, toVersionComment)
      .then(response => {
        this.setState({isLoading: false});
        if (
          response.data &&
          response.data.moveQuaysToStop &&
          response.data.moveQuaysToStop.id
        ) {
          newStopPlaceId = response.data.moveQuaysToStop.id;
        }
        dispatch(UserActions.closeMoveQuayToNewStopDialog());
        dispatch(
          UserActions.openSnackbar(types.SUCCESS)
        );
        getStopPlaceWithAll(client, stopPlace.id).then(response => {
          if (newStopPlaceId) {
            dispatch(
              UserActions.openSuccessfullyCreatedNewStop(newStopPlaceId)
            );
          }
        });
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  }

  handleLoadVersion = ({ id, version }) => {
    const { client } = this.props;
    client.query({
      fetchPolicy: 'network-only',
      query: stopPlaceAndPathLinkByVersion,
      variables: {
        id,
        version
      }
    });
  };

  getTitleText = (stopPlace, originalStopPlace, formatMessage) => {
    const stopPlaceName = originalStopPlace ? originalStopPlace.name : stopPlace.name;
    return stopPlace && stopPlace.id
      ? `${stopPlaceName}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
      : formatMessage({ id: 'new_stop_title' });
  };

  getQuayItemName = (locale, stopPlace) => {
    stopTypes[locale].forEach(stopType => {
      if (stopType.value === stopPlace.stopPlaceType) {
        return stopType.quayItemName;
      }
    });
  };

  getQuaysForMoveQuayToNewStop(){
    const { stopPlace, movingQuayToNewStop, neighbourStopQuays } = this.props;
    if (!movingQuayToNewStop || !stopPlace) return [];
    const { stopPlaceId } = movingQuayToNewStop;
    if (stopPlaceId == stopPlace.id) {
      return stopPlace.quays;
    } else {
      return neighbourStopQuays[stopPlaceId] || [];
    }
  }

  render() {
    const {
      stopPlace,
      stopHasBeenModified,
      activeElementTab,
      intl,
      showEditStopAdditional,
      versions,
      disabled,
      canDeleteStop,
      mergeStopDialogOpen,
      originalStopPlace,
      deleteQuayImportedId
    } = this.props;
    const { formatMessage, locale } = intl;

    if (!stopPlace) return null;

    const translations = {
      name: formatMessage({ id: 'name' }),
      publicCode: formatMessage({ id: 'publicCode' }),
      description: formatMessage({ id: 'description' }),
      unsaved: formatMessage({ id: 'unsaved' }),
      undefined: formatMessage({ id: 'undefined' }),
      none: formatMessage({ id: 'none_no' }),
      quays: formatMessage({ id: 'quays' }),
      pathJunctions: formatMessage({ id: 'pathJunctions' }),
      entrances: formatMessage({ id: 'entrances' }),
      quayItemName: this.getQuayItemName(locale, stopPlace),
      capacity: formatMessage({ id: 'total_capacity' }),
      parkAndRide: formatMessage({ id: 'parking' }),
      bikeParking: formatMessage({ id: 'bike_parking' }),
      unknown: formatMessage({ id: 'uknown_parking_type' }),
      elements: formatMessage({ id: 'elements' }),
      versions: formatMessage({ id: 'versions' }),
      validBetween: formatMessage({ id: 'valid_between' })
    };

    const stopPlaceLabel = this.getTitleText(stopPlace, originalStopPlace, formatMessage);
    const isCurrentVersionMax = getIsCurrentVersionMax(versions, stopPlace.version, stopPlace.isChildOfParent);

    const style = {
      border: '1px solid #511E12',
      background: '#fff',
      width: 405,
      marginTop: 1,
      position: 'absolute',
      zIndex: 999,
      marginLeft: 2
    };

    const scrollable = {
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      height: '82vh',
      position: 'relative',
      display: 'block',
      marginTop: 2
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

    const tabStyle = { color: '#000', fontSize: 10, fontWeight: 600 };
    const disableTerminate = stopPlace.isNewStop || disabled || (stopPlace.hasExpired && !isCurrentVersionMax);
    const quaysForMoveQuayToNewStop = this.getQuaysForMoveQuayToNewStop();

    return (
      <div style={style}>
        <div style={stopBoxBar}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <MdBack
              color="#fff"
              style={{
                cursor: 'pointer',
                marginRight: 2,
                transform: 'scale(0.8)'
              }}
              onClick={() => this.handleAllowUserToGoBack()}
            />
            <div>{stopPlaceLabel}</div>
          </div>
          <VersionsPopover
            versions={versions}
            buttonLabel={translations.versions}
            disabled={!versions.length}
            hide={stopPlace.isChildOfParent}
            handleSelect={this.handleLoadVersion.bind(this)}
          />
        </div>
        <div id="scroll-body" style={scrollable}>
          <div style={{ padding: '5 5' }}>
            <StopPlaceDetails
              disabled={disabled}
              intl={intl}
              expanded={showEditStopAdditional}
              showLessStopPlace={this.showLessStopPlace.bind(this)}
              showMoreStopPlace={this.showMoreStopPlace.bind(this)}
            />
            {showEditStopAdditional
              ? <EditStopAdditional disabled={disabled} />
              : null}
            <div style={{ textAlign: 'center', marginBottom: 5 }}>
              {showEditStopAdditional
                ? <FlatButton
                    icon={<MdLess />}
                    onClick={() => this.showLessStopPlace()}
                  />
                : <FlatButton
                    label={formatMessage({ id: 'more' })}
                    labelStyle={{ fontSize: 12 }}
                    onClick={() => this.showMoreStopPlace()}
                  />}
            </div>
            <Divider inset={true} />
            <Tabs
              onChange={this.handleSlideChange.bind(this)}
              value={activeElementTab}
              tabItemContainerStyle={{ backgroundColor: '#fff' }}
            >
              <Tab
                style={tabStyle}
                label={`${formatMessage({ id: 'quays' })} (${stopPlace.quays
                  ? stopPlace.quays.length
                  : 0})`}
                value={0}
              />
              <Tab
                style={tabStyle}
                label={`${formatMessage({ id: 'navigation' })} (${stopPlace
                  .pathJunctions.length + stopPlace.entrances.length})`}
                value={1}
              />
              <Tab
                style={tabStyle}
                label={`${formatMessage({ id: 'parking_general' })} (${stopPlace
                  .parking.length})`}
                value={2}
              />
            </Tabs>
            <EditStopBoxTabs
              disabled={disabled}
              activeStopPlace={stopPlace}
              itemTranslation={translations}
            />
          </div>
          <ConfirmDialog
            open={this.state.confirmUndoOpen}
            handleClose={() => {
              this.handleDialogClose('confirmUndoOpen');
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
          <ConfirmDialog
            open={this.state.confirmGoBack}
            handleClose={() => {
              this.handleDialogClose('confirmGoBack');
            }}
            handleConfirm={() => {
              this.handleGoBack();
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
                  this.handleDialogClose();
                }}
                handleConfirm={this.handleSaveAllEntities.bind(this)}
                errorMessage={this.state.errorMessage}
                intl={intl}
                serverTimeDiff={this.props.serverTimeDiff}
                currentValidBetween={stopPlace.validBetween}
              />
            : null}
          <MergeStopDialog
            open={mergeStopDialogOpen}
            handleClose={this.handleCloseMergeStopDialog.bind(this)}
            handleConfirm={this.handleMergeQuaysFromStop.bind(this)}
            isFetchingQuays={this.props.isFetchingMergeInfo}
            isLoading={this.state.isLoading}
            intl={intl}
            hasStopBeenModified={stopHasBeenModified}
            sourceElement={this.props.mergeSource}
            targetElement={{
              id: stopPlace.id,
              name: stopPlace.name
            }}
          />
          <MergeQuaysDialog
            open={this.props.mergingQuayDialogOpen}
            handleClose={this.handleCloseMergeQuaysDialog.bind(this)}
            handleConfirm={this.handleMergeQuays.bind(this)}
            intl={intl}
            mergingQuays={this.props.mergingQuay}
            hasStopBeenModified={stopHasBeenModified}
            isLoading={this.state.isLoading}
          />
          <DeleteQuayDialog
            open={this.props.deleteQuayDialogOpen}
            handleClose={this.handleCloseDeleteQuay.bind(this)}
            handleConfirm={this.handleDeleteQuay.bind(this)}
            intl={intl}
            deletingQuay={this.props.deletingQuay}
            isLoading={this.state.isLoading}
            importedId={deleteQuayImportedId}
          />
          <TerminateStopPlaceDialog
            open={this.props.deleteStopDialogOpen}
            handleClose={this.handleCloseDeleteStop.bind(this)}
            handleConfirm={this.handleTerminateStop.bind(this)}
            intl={intl}
            previousValidBetween={stopPlace.validBetween}
            stopPlace={stopPlace}
            canDeleteStop={canDeleteStop}
            isLoading={this.state.isLoading}
            serverTimeDiff={this.props.serverTimeDiff}
          />
          <MoveQuayDialog
            open={this.props.moveQuayDialogOpen}
            handleClose={this.handleCloseMoveQuay.bind(this)}
            handleConfirm={this.handleMoveQuay.bind(this)}
            intl={intl}
            stopPlaceId={stopPlace.id}
            quay={this.props.movingQuay}
            hasStopBeenModified={stopHasBeenModified}
            isLoading={this.state.isLoading}
          />
          <MoveQuayNewStopDialog
            open={this.props.moveQuayToNewStopDialogOpen}
            handleClose={this.handleCloseMoveQuayNewStop.bind(this)}
            quays={quaysForMoveQuayToNewStop}
            handleConfirm={this.handleMoveQuaysNewStop.bind(this)}
            intl={intl}
            quay={this.props.movingQuayToNewStop}
            hasStopBeenModified={stopHasBeenModified}
            isLoading={this.state.isLoading}
          />
          <RequiredFieldsMissingDialog
            open={this.state.requiredFieldsMissingOpen}
            handleClose={() => { this.setState({requiredFieldsMissingOpen: false}) }}
            requiredMissing={{
              name: !stopPlace.name || !stopPlace.name.trim().length,
              type: !stopPlace.stopPlaceType
            }}
            formatMessage={formatMessage}
            isNewStop={stopPlace.isNewStop}
          />
        </div>
        <div
          style={{
            border: '1px solid #efeeef',
            textAlign: 'right',
            width: '100%',
            display: isCurrentVersionMax ? 'flex' : 'none',
            justifyContent: 'space-around'
          }}
        >
          { !stopPlace.isChildOfParent && isCurrentVersionMax &&
              <FlatButton
                disabled={disableTerminate}
                label={formatMessage({ id: 'terminate_stop_place' })}
                style={{ margin: '8 5', zIndex: 999 }}
                labelStyle={{ fontSize: '0.7em', color: disableTerminate ? 'rgba(0, 0, 0, 0.3)' : 'initial'}}
                onClick={() => {
                  this.props.dispatch(UserActions.requestTerminateStopPlace())
                }}
              />
          }
          <FlatButton
            icon={<MdUndo style={{height: '1.3em', width: '1.3em'}} />}
            disabled={!stopHasBeenModified}
            label={formatMessage({ id: 'undo_changes' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={() => {
              this.setState({ confirmUndoOpen: true });
            }}
          />
          <FlatButton
            icon={<MdSave style={{height: '1.3em', width: '1.3em'}}/>}
            disabled={disabled || !stopHasBeenModified}
            label={formatMessage({ id: 'save_new_version' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={this.handleSave.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current,
  mergeStopDialogOpen: state.stopPlace.mergeStopDialog
    ? state.stopPlace.mergeStopDialog.isOpen
    : false,
  mergeSource: state.stopPlace.mergeStopDialog,
  pathLink: state.stopPlace.pathLink,
  stopHasBeenModified: state.stopPlace.stopHasBeenModified,
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  activeElementTab: state.user.activeElementTab,
  showEditQuayAdditional: state.user.showEditQuayAdditional,
  showEditStopAdditional: state.user.showEditStopAdditional,
  mergingQuay: state.mapUtils.mergingQuay,
  mergingQuayDialogOpen: state.mapUtils.mergingQuayDialogOpen,
  deleteQuayDialogOpen: state.mapUtils.deleteQuayDialogOpen,
  deleteQuayImportedId: state.mapUtils.deleteQuayImportedId,
  deleteStopDialogOpen: state.mapUtils.deleteStopDialogOpen,
  deletingQuay: state.mapUtils.deletingQuay,
  versions: state.stopPlace.versions,
  originalPathLink: state.stopPlace.originalPathLink,
  moveQuayDialogOpen: state.mapUtils.moveQuayDialogOpen,
  moveQuayToNewStopDialogOpen: state.mapUtils.moveQuayToNewStopDialogOpen,
  movingQuay: state.mapUtils.movingQuay,
  movingQuayToNewStop: state.mapUtils.movingQuayToNewStop,
  activeMap: state.mapUtils.activeMap,
  canDeleteStop: getIn(state.roles, ['allowanceInfo', 'canDeleteStop'], false),
  originalStopPlace: state.stopPlace.originalCurrent,
  serverTimeDiff: state.user.serverTimeDiff,
  isFetchingMergeInfo: state.stopPlace.isFetchingMergeInfo,
  neighbourStopQuays: state.stopPlace.neighbourStopQuays
});

export default withApollo(
  injectIntl(connect(mapStateToProps)(EditStopGeneral))
);
