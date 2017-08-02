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
import {
  mutateStopPlace,
  mutatePathLink,
  mutateParking
} from '../../graphql/Mutations';
import { stopPlaceAndPathLinkByVersion } from '../../graphql/Queries';
import * as types from '../../actions/Types';
import EditStopAdditional from './EditStopAdditional';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import MdBack from 'material-ui/svg-icons/navigation/arrow-back';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import Divider from 'material-ui/Divider';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
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
  moveQuaysToNewStop
} from '../../graphql/Actions';
import IconButton from 'material-ui/IconButton';
import MdDelete from 'material-ui/svg-icons/action/delete-forever';
import DeleteStopPlaceDialog from '../Dialogs/DeleteStopPlaceDialog';
import MoveQuayDialog from '../Dialogs/MoveQuayDialog';
import MoveQuayNewStopDialog from '../Dialogs/MoveQuayNewStopDialog';
import Settings from '../../singletons/SettingsManager';
import { getIn } from '../../utils/';

class EditStopGeneral extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmUndoOpen: false,
      confirmGoBack: false,
      saveDialogOpen: false,
      errorMessage: '',
      versionsOpen: false
    };
  }

  handleSave() {
    this.setState({
      saveDialogOpen: true,
      errorMessage: ''
    });
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

  handleMergeQuaysFromStop(fromVersionComment, toVersionComment) {
    const { stopPlace, mergeSource, client, dispatch, activeMap } = this.props;

    mergeAllQuaysFromStop(client, mergeSource.id, stopPlace.id, fromVersionComment, toVersionComment).then(result => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS)
      );
      this.handleCloseMergeStopDialog();
      getStopPlaceWithAll(client, stopPlace.id).then( () => {
        if (activeMap) {
          let includeExpired = new Settings().getShowExpiredStops();
          getNeighbourStops(client, stopPlace.id, activeMap.getBounds(), includeExpired);
        }
      });
    }).catch(err => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR)
      );
    });
  }

  handleMergeQuays(versionComment) {
    const { mergingQuay, client, stopPlace, dispatch } = this.props;

    mergeQuays(
      client,
      stopPlace.id,
      mergingQuay.fromQuay.id,
      mergingQuay.toQuay.id,
      versionComment
    ).then(result => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS)
      );
      this.handleCloseMergeQuaysDialog();
      getStopPlaceWithAll(client, stopPlace.id);
    }).catch( err => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR)
      );
    });
  }

  handleDeleteQuay() {
    const {client, deletingQuay, dispatch, stopPlace} = this.props;
    deleteQuay(client, deletingQuay).then(response => {
      dispatch(UserActions.hideDeleteQuayDialog());
      getStopPlaceWithAll(client, stopPlace.id).then(response => {
        dispatch(
          UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS)
        );
      });
    }).catch(err => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR)
      );
    });
  }

  handleMoveQuay(fromVersionComment, toVersionComment) {
    const { client, movingQuay, dispatch, stopPlace } = this.props;
    moveQuaysToStop(client, stopPlace.id, movingQuay.id, fromVersionComment, toVersionComment).then(response => {
      dispatch(UserActions.closeMoveQuayDialog());
      getStopPlaceWithAll(client, stopPlace.id);
    }).catch(err => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR)
      );
    });
  };

  handleDeleteStop() {
    const { client, stopPlace, dispatch } = this.props;
    deleteStopPlace(client, stopPlace.id)
      .then(response => {
        dispatch(UserActions.hideDeleteStopDialog());
        if (response.data.deleteStopPlace) {
          dispatch(UserActions.navigateToMainAfterDelete());
        } else {
          UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR);
        }
      })
      .catch( err => {
        dispatch(UserActions.hideDeleteStopDialog(true));
        dispatch(UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR));
      });
  }

  handleSaveAllEntities(userInput) {
    const { stopPlace, pathLink, originalPathLink } = this.props;
    const stopPlaceVariables = mapToMutationVariables.mapStopToVariables(
      stopPlace,
      userInput
    );
    const shouldMutateParking = !!(
      stopPlace.parking && stopPlace.parking.length
    );
    const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(
      pathLink
    );

    const shouldMutatePathLinks = !!(
      pathLinkVariables.length &&
      JSON.stringify(pathLink) !== JSON.stringify(originalPathLink)
    );

    let id = null;

    const { client } = this.props;

    client
      .mutate({ variables: stopPlaceVariables, mutation: mutateStopPlace })
      .then(result => {
        if (result.data.mutateStopPlace[0].id) {
          id = result.data.mutateStopPlace[0].id;
        }
      })
      .then(() => {
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
    moveQuaysToNewStop(client, quayIds, fromVersionComment, toVersionComment).then(response => {
      dispatch(UserActions.closeMoveQuayToNewStopDialog());
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS)
      );
      getStopPlaceWithAll(client, stopPlace.id).then( response => {
        if (response.data && response.data.stopPlace && response.data.stopPlace.length) {
          dispatch(UserActions.openSuccessfullyCreatedNewStop(response.data.stopPlace[0].id));
        };
      });
    }).catch(err => {
      dispatch(
        UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.ERROR)
      );
    });
  }

  handleTouchTapVersions = event => {
    event.preventDefault();
    this.setState({
      versionsOpen: true,
      anchorEl: event.currentTarget
    });
  };

  handleLoadVersion = ({ id, version }) => {
    this.setState({
      versionsOpen: false
    });

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

  getTitleText = (stopPlace, formatMessage) => {
    return stopPlace && stopPlace.id
      ? `${stopPlace.name}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
      : formatMessage({ id: 'new_stop_title' });
  };

  getQuayItemName = (locale, stopPlace) => {
    stopTypes[locale].forEach(stopType => {
      if (stopType.value === stopPlace.stopPlaceType) {
        return stopType.quayItemName;
      }
    });
  };

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
      mergeStopDialogOpen
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

    const stopPlaceLabel = this.getTitleText(stopPlace, formatMessage);

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
      overflowY: 'scroll',
      overflowX: 'hidden',
      width: '100%',
      height: '78vh',
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
          <FlatButton
            label={translations.versions}
            disabled={!versions.length}
            labelStyle={{
              color: '#fff',
              fontSize: 10,
              borderBottom: '1px dotted #fff',
              color: '#fff',
              padding: 0
            }}
            style={{ margin: 0, zIndex: 999 }}
            onTouchTap={this.handleTouchTapVersions}
          />
          <Popover
            open={this.state.versionsOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => this.setState({ versionsOpen: false })}
            animation={PopoverAnimationVertical}
          >
            <Menu menuItemStyle={{ fontSize: 12 }} autoWidth={true}>
              {versions.map((version, i) =>
                <MenuItem
                  key={'version' + i}
                  primaryText={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: 8, fontWeight: 600 }}>
                          {version.version}
                        </div>
                        <div>{version.name}</div>
                      </div>
                      <div style={{ marginTop: -10 }}>
                        {version.changedBy || 'N/A'}: {version.versionComment || 'N/A'}
                      </div>
                    </div>
                  }
                  secondaryText={
                    <div
                      style={{ transform: 'translateY(-14px)' }}
                    >{`${version.fromDate || 'N/A'} - ${version.toDate ||
                      'N/A'}`}</div>
                  }
                  onTouchTap={() => this.handleLoadVersion(version)}
                />
              )}
            </Menu>
          </Popover>
        </div>
        <div id="scroll-body" style={scrollable}>
          <div style={{ padding: '10 5' }}>
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
                  .length})`}
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
              />
            : null}
          <MergeStopDialog
            open={mergeStopDialogOpen}
            handleClose={this.handleCloseMergeStopDialog.bind(this)}
            handleConfirm={this.handleMergeQuaysFromStop.bind(this)}
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
          />
          <DeleteQuayDialog
            open={this.props.deleteQuayDialogOpen}
            handleClose={this.handleCloseDeleteQuay.bind(this)}
            handleConfirm={this.handleDeleteQuay.bind(this)}
            intl={intl}
            deletingQuay={this.props.deletingQuay}
          />
          <DeleteStopPlaceDialog
            open={this.props.deleteStopDialogOpen}
            handleClose={this.handleCloseDeleteStop.bind(this)}
            handleConfirm={this.handleDeleteStop.bind(this)}
            intl={intl}
            stopPlace={stopPlace}
          />
          <MoveQuayDialog
            open={this.props.moveQuayDialogOpen}
            handleClose={this.handleCloseMoveQuay.bind(this)}
            handleConfirm={this.handleMoveQuay.bind(this)}
            intl={intl}
            stopPlaceId={stopPlace.id}
            quay={this.props.movingQuay}
            hasStopBeenModified={stopHasBeenModified}
          />
          <MoveQuayNewStopDialog
            open={this.props.moveQuayToNewStopDialogOpen}
            handleClose={this.handleCloseMoveQuayNewStop.bind(this)}
            quays={stopPlace.quays}
            handleConfirm={this.handleMoveQuaysNewStop.bind(this)}
            intl={intl}
            fromStopPlaceId={stopPlace.id}
            quay={this.props.movingQuayToNewStop}
            hasStopBeenModified={stopHasBeenModified}
            />
        </div>
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
          <IconButton
            disabled={!canDeleteStop || stopPlace.isNewStop}
            onClick={() => {
              canDeleteStop && this.props.dispatch(UserActions.requestDeleteStopPlace());
            }}
          >
            <MdDelete />
          </IconButton>
          <FlatButton
            icon={<MdSave />}
            disabled={disabled || !stopHasBeenModified || !stopPlace.name.length }
            label={formatMessage({ id: 'save_new_version' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.8em' }}
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
  deleteStopDialogOpen: state.mapUtils.deleteStopDialogOpen,
  deletingQuay: state.mapUtils.deletingQuay,
  versions: state.stopPlace.versions,
  originalPathLink: state.stopPlace.originalPathLink,
  moveQuayDialogOpen: state.mapUtils.moveQuayDialogOpen,
  moveQuayToNewStopDialogOpen: state.mapUtils.moveQuayToNewStopDialogOpen,
  movingQuay: state.mapUtils.movingQuay,
  movingQuayToNewStop: state.mapUtils.movingQuayToNewStop,
  activeMap: state.mapUtils.activeMap,
  canDeleteStop: getIn(state.roles, ['allowanceInfo', 'canDeleteStop'], false)
});

export default withApollo(
  injectIntl(connect(mapStateToProps)(EditStopGeneral))
);
