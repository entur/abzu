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
import StopPlaceMarker from './StopPlaceMarker';
import NewStopMarker from './NewStopMarker';
import { StopPlaceActions, UserActions } from '../../actions/';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import stopTypes from '../../models/stopTypes';
import JunctionMarker from './JunctionMarker';
import NeighbourMarker from './NeighbourMarker';
import ParkAndRideMarker from './ParkAndRideMarker';
import CycleParkingMarker from './CycleParkingMarker';
import { setDecimalPrecision, getIn } from '../../utils';
import QuayMarker from './QuayMarker';
import { withApollo } from 'react-apollo';
import { allEntities, neighbourStopPlaceQuays } from '../../graphql/Queries';
import CoordinateMarker from './CoordinateMarker';

class MarkerList extends React.Component {
  static PropTypes = {
    stops: PropTypes.array.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.createMarkerList(this.props);
  }

  componentWillUpdate(nextProps) {
    this.createMarkerList(nextProps);
  }

  handleAdjustCentroid() {
    this.props.dispatch(StopPlaceActions.adjustCentroid());
  }

  handleStopOnClick(id) {
    const { dispatch, client, path } = this.props;

    const isAlreadyActive = id == path;

    if (!isAlreadyActive) {
      client
        .query({
          fetchPolicy: 'network-only',
          query: allEntities,
          variables: {
            id: id,
          },
        })
        .then(result => {
          dispatch(UserActions.navigateTo('/edit/', id));
        });
    }
  }

  handleNewStopClick() {
    const { dispatch, intl } = this.props;
    dispatch(StopPlaceActions.useNewStopAsCurrent());
    dispatch(UserActions.navigateTo('/edit/', 'new'));
    document.title = intl.formatMessage({ id: '_title_new_stop' });
  }

  createNewMultimodalStopFrom(stopPlaceId) {
    const { dispatch, client, isEditingStop } = this.props;
    dispatch(UserActions.createMultimodalWith(client, stopPlaceId, !isEditingStop));
  }

  handleDragEndNewStop(event) {
    this.props.dispatch(
      StopPlaceActions.changeLocationNewStop(event.target.getLatLng())
    );
  }

  handleShowQuays(id) {
    this.props.client.query({
      fetchPolicy: 'network-only',
      query: neighbourStopPlaceQuays,
      variables: {
        id: id,
      },
    });
  }

  handleMergeStopPlace(id, name) {
    this.props.dispatch(UserActions.showMergeStopDialog(id, name));
  }

  handleHideQuays(id) {
    this.props.dispatch(UserActions.hideQuaysForNeighbourStop(id));
  }

  handleUpdatePathLink(coords, id, type) {
    const { isCreatingPolylines, activeMap, pathLink } = this.props;

    if (activeMap) activeMap.closePopup();

    if (pathLink && pathLink.length) {
      let lastPathLink = pathLink[pathLink.length - 1];

      const lastPathLinkFromId = getIn(
        lastPathLink,
        ['from', 'placeRef', 'addressablePlace', 'id'],
        null,
      );

      if (lastPathLinkFromId === id && !lastPathLink.to) {
        this.props.dispatch(UserActions.removeLastPolyline());
        return;
      }
    }

    if (isCreatingPolylines) {
      this.props.dispatch(
        UserActions.addFinalCoordinesToPolylines(coords, id, type),
      );
    } else {
      this.props.dispatch(UserActions.startCreatingPolyline(coords, id, type));
    }
  }

  handleElementDragEnd(index, type, event) {
    const { dispatch } = this.props;
    const position = event.target.getLatLng();

    dispatch(
      StopPlaceActions.changeElementPosition(index, type, [
        setDecimalPrecision(position.lat, 6),
        setDecimalPrecision(position.lng, 6),
      ]),
    );
  }

  createMarkerList(props) {
    const {
      stops,
      handleDragEnd,
      changeCoordinates,
      dragableMarkers,
      neighbourStopQuays,
      missingCoordinatesMap,
      handleSetCompassBearing,
      disabled,
      disabledForSearch,
      intl,
      showExpiredStops,
      isEditingStop,
      currentIsNewStop,
      currentStopIsMultiModal,
      tokenParsed
    } = props;
    const { formatMessage } = intl;

    let popupMarkers = [];

    const CustomPopupMarkerText = {
      untitled: formatMessage({ id: 'untitled' }),
      coordinates: formatMessage({ id: 'coordinates' }),
      createPathLinkHere: formatMessage({ id: 'create_path_link_here' }),
      terminatePathLinkHere: formatMessage({ id: 'terminate_path_link_here' }),
      cancelPathLink: formatMessage({ id: 'cancel_path_link' }),
      showQuays: formatMessage({ id: 'show_quays' }),
      hideQuays: formatMessage({ id: 'hide_quays' }),
      inComplete: formatMessage({ id: 'path_link_incomplete' }),
      saveFirstPathLink: formatMessage({ id: 'save_first_path_link' }),
      mergeStopPlace: formatMessage({ id: 'merge_stop_here' }),
      mergeQuayFrom: formatMessage({ id: 'merge_quay_from' }),
      mergeQuayTo: formatMessage({ id: 'merge_quay_to' }),
      mergeQuayCancel: formatMessage({ id: 'merge_quay_cancel' }),
      expired: formatMessage({ id: 'has_expired'}),
      publicCode: formatMessage({id: 'publicCode'}),
      privateCode: formatMessage({id: 'privateCode'}),
      moveQuayToCurrent: formatMessage({id: 'move_quay_to_current'}),
      moveQuaysToNewStop: formatMessage({id: 'move_quays_to_new_stop'}),
      adjustCentroid: formatMessage({id: 'adjust_centroid'}),
      createMultimodal: formatMessage({id: 'new__multi_stop'})
    };

    const newStopMarkerText = {
      newStopTitle: formatMessage({ id: 'new_stop_title' }),
      newParentStopTitle: formatMessage({ id: 'new_parent_stop_title' }),
      newParentStopQuestion: formatMessage({ id: 'new_parent_stop_question' }),
      newStopQuestion: formatMessage({ id: 'new_stop_question' }),
      createNow: formatMessage({ id: 'create_now' }),
      createNotAllowed: formatMessage({id: 'create_not_allowed'})
    };

    stops.forEach((stop, stopIndex) => {
      const localeStopType = getLocaleStopTypeName(stop.stopPlaceType, intl);

      if (stop.coordinatePin) {
        popupMarkers.push(
          <CoordinateMarker position={stop.position} key={'coordinatePin'}
          />
        );
      }

      if (stop.isNewStop && !isEditingStop) {
        popupMarkers.push(
          <NewStopMarker
            key={'newstop-parent- ' + stopIndex}
            position={stop.location}
            newStopIsMultiModal={this.props.newStopIsMultiModal}
            handleDragEnd={this.handleDragEndNewStop.bind(this)}
            text={newStopMarkerText}
            handleOnClick={() => {
              this.handleNewStopClick(stop.location);
            }}
          />,
        );
      } else {
        if (stop.isActive) {
          if (stop.isParent && stop.children) {
            stop.children.forEach( (child, i) => {
              popupMarkers.push(
                <StopPlaceMarker
                  key={'stopPlace-child-' + stop.id + '-' + i}
                  id={child.id}
                  index={stopIndex}
                  position={child.location}
                  name={child.name || stop.name}
                  isShowingQuays={!!neighbourStopQuays[child.id]}
                  handleShowQuays={this.handleShowQuays.bind(this)}
                  handleHideQuays={this.handleHideQuays.bind(this)}
                  submode={child.submode}
                  formattedStopType={localeStopType}
                  isMultimodal={false}
                  isMultimodalChild={true}
                  disabled={disabled}
                  disabledForSearch={disabledForSearch}
                  handleDragEnd={handleDragEnd}
                  active={false}
                  stopType={child.stopPlaceType}
                  handleAdjustCentroid={this.handleAdjustCentroid.bind(this)}
                  draggable={false}
                  handleChangeCoordinates={changeCoordinates}
                  translations={CustomPopupMarkerText}
                  handleOnClick={() => {
                    this.handleStopOnClick(child.id);
                  }}
                  isEditingStop={isEditingStop}
                  missingCoordinatesMap={missingCoordinatesMap}
                  createNewMultimodalStopFrom={this.createNewMultimodalStopFrom.bind(this)}
                />
              );

              if (neighbourStopQuays[child.id]) {
                neighbourStopQuays[child.id].forEach( (quayOfChild, index) => {
                  popupMarkers.push(
                    <QuayMarker
                      index={index}
                      parentId={stopIndex}
                      id={quayOfChild.id}
                      position={quayOfChild.location}
                      key={'quay-neighbour-child' + quayOfChild.id}
                      handleQuayDragEnd={() => {}}
                      translations={Object.assign(
                        {},
                        newStopMarkerText,
                        CustomPopupMarkerText,
                      )}
                      compassBearing={quayOfChild.compassBearing}
                      publicCode={quayOfChild.publicCode || ''}
                      privateCode={quayOfChild.privateCode || ''}
                      parentStopPlaceName={stop.name}
                      parentStopPlaceId={child.id}
                      formattedStopType={localeStopType}
                      handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                      handleChangeCoordinates={() => {}}
                      draggable={false}
                      belongsToNeighbourStop={true}
                      handleSetCompassBearing={() => {}}
                      showPathLink={!disabled}
                      isEditingStop={isEditingStop}
                      disabled={disabled}
                      currentIsNewStop={currentIsNewStop}
                    />,
                  )
                });
              }

            })
          }

          popupMarkers.push(
            <StopPlaceMarker
              key={'stopPlace-' + stop.id}
              id={stop.id}
              index={stopIndex}
              position={stop.location}
              name={stop.name}
              submode={stop.submode}
              formattedStopType={localeStopType}
              isMultimodal={stop.isParent}
              disabled={disabled}
              handleDragEnd={handleDragEnd}
              active={!!stop.isActive}
              stopType={stop.stopPlaceType}
              handleAdjustCentroid={this.handleAdjustCentroid.bind(this)}
              draggable={dragableMarkers}
              handleChangeCoordinates={changeCoordinates}
              createNewMultimodalStopFrom={this.createNewMultimodalStopFrom.bind(this)}
              translations={CustomPopupMarkerText}
              handleOnClick={() => {
                this.handleStopOnClick(stop.id);
              }}
              isEditingStop={isEditingStop}
              missingCoordinatesMap={missingCoordinatesMap}
              isMultimodalChild={stop.isChildOfParent}
            />,
          );

          if (stop.parking) {
            stop.parking.forEach((parking, index) => {
              let isParkAndRide =
                parking.parkingVehicleTypes &&
                parking.parkingVehicleTypes.indexOf('car') > -1;
              let isCycleParking =
                parking.parkingVehicleTypes &&
                parking.parkingVehicleTypes.indexOf('pedalCycle') > -1;

              if (isParkAndRide) {
                popupMarkers.push(
                  <ParkAndRideMarker
                    position={parking.location}
                    index={index}
                    name={parking.name || ''}
                    hasExpired={parking.hasExpired}
                    draggable={!disabled}
                    type="parking"
                    key={'parking-' + index}
                    totalCapacity={parking.totalCapacity}
                    translations={{
                      title: formatMessage({ id: 'parking' }),
                      totalCapacity: formatMessage({ id: 'total_capacity' }),
                      parkingExpired: formatMessage({id: 'parking_expired'}),
                      totalCapacityUnknown: formatMessage({
                        id: 'total_capacity_unknown',
                      }),
                    }}
                    handleDragEnd={this.handleElementDragEnd.bind(this)}
                  />,
                );
              } else if (isCycleParking) {
                popupMarkers.push(
                  <CycleParkingMarker
                    position={parking.location}
                    index={index}
                    name={parking.name || ''}
                    totalCapacity={parking.totalCapacity}
                    hasExpired={parking.hasExpired}
                    key={'parking-' + index}
                    draggable={!disabled}
                    type="parking"
                    translations={{
                      title: formatMessage({ id: 'parking_bike' }),
                      totalCapacity: formatMessage({ id: 'total_capacity' }),
                      parkingExpired: formatMessage({id: 'parking_expired'}),
                      totalCapacityUnknown: formatMessage({
                        id: 'total_capacity_unknown',
                      }),
                    }}
                    handleDragEnd={this.handleElementDragEnd.bind(this)}
                  />,
                );
              }
            });
          }

          if (stop.quays) {
            stop.quays.forEach((quay, index) => {
              popupMarkers.push(
                <QuayMarker
                  index={index}
                  parentId={stopIndex}
                  id={quay.id}
                  position={quay.location}
                  key={'quay-' + (quay.id || index)}
                  handleQuayDragEnd={this.handleElementDragEnd.bind(this)}
                  translations={Object.assign(
                    {},
                    newStopMarkerText,
                    CustomPopupMarkerText,
                  )}
                  compassBearing={quay.compassBearing}
                  publicCode={quay.publicCode || ''}
                  privateCode={quay.privateCode || ''}
                  parentStopPlaceName={stop.name}
                  disabled={disabled}
                  formattedStopType={localeStopType}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  handleChangeCoordinates={changeCoordinates}
                  draggable={!disabled}
                  belongsToNeighbourStop={!stop.isActive}
                  handleSetCompassBearing={handleSetCompassBearing}
                  showPathLink={!disabled}
                  isEditingStop={isEditingStop}
                  currentIsNewStop={currentIsNewStop}
                />,
              );
            });
          }

          if (stop.entrances) {
            const junctionMarkerText = {
              junctionTitle: formatMessage({ id: 'entrance' }),
            };

            stop.entrances.forEach((entrance, index) => {
              popupMarkers.push(
                <JunctionMarker
                  position={entrance.location}
                  index={index}
                  key={'entrance-' + index}
                  type="entrance"
                  handleDragEnd={this.handleElementDragEnd.bind(this)}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  text={Object.assign(
                    {},
                    junctionMarkerText,
                    CustomPopupMarkerText,
                  )}
                  name={entrance.name}
                />,
              );
            });
          }

          if (stop.pathJunctions) {
            const junctionMarkerText = {
              junctionTitle: formatMessage({ id: 'pathJunction' }),
            };

            stop.pathJunctions.forEach((pathJunction, index) => {
              popupMarkers.push(
                <JunctionMarker
                  position={pathJunction.location}
                  key={'pathjunction-' + index}
                  index={index}
                  type="pathJunction"
                  handleDragEnd={this.handleElementDragEnd.bind(this)}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  text={Object.assign(
                    {},
                    junctionMarkerText,
                    CustomPopupMarkerText,
                  )}
                  name={pathJunction.name}
                />,
              );
            });
          }
        } else {

          if ((showExpiredStops && stop.hasExpired) || !stop.hasExpired) {

            popupMarkers.push(
              <NeighbourMarker
                key={'neighbourStop-' + stop.id}
                id={stop.id}
                position={stop.location}
                name={stop.name}
                handleOnClick={() => {
                  this.handleStopOnClick(stop.id);
                }}
                index={stopIndex}
                isChildOfParent={stop.isChildOfParent}
                submode={stop.submode}
                translations={CustomPopupMarkerText}
                isEditingStop={isEditingStop}
                isMultimodal={stop.isParent}
                currentStopIsMultiModal={currentStopIsMultiModal}
                disabled={disabled}
                stopType={stop.stopPlaceType}
                handleMergeStopPlace={this.handleMergeStopPlace.bind(this)}
                isShowingQuays={!!neighbourStopQuays[stop.id]}
                handleShowQuays={this.handleShowQuays.bind(this)}
                handleHideQuays={this.handleHideQuays.bind(this)}
                hasExpired={stop.hasExpired}
                createNewMultimodalStopFrom={this.createNewMultimodalStopFrom.bind(this)}
                stopPlace={stop}
                tokenParsed={tokenParsed}
              />,
            );

            if (neighbourStopQuays && neighbourStopQuays[stop.id]) {
              neighbourStopQuays[stop.id].forEach((quay, index) => {
                popupMarkers.push(
                  <QuayMarker
                    index={index}
                    parentId={stopIndex}
                    id={quay.id}
                    position={quay.location}
                    key={'quay-neighbour' + quay.id}
                    handleQuayDragEnd={() => {}}
                    translations={Object.assign(
                      {},
                      newStopMarkerText,
                      CustomPopupMarkerText,
                    )}
                    compassBearing={quay.compassBearing}
                    publicCode={quay.publicCode || ''}
                    privateCode={quay.privateCode || ''}
                    parentStopPlaceName={stop.name}
                    parentStopPlaceId={stop.id}
                    formattedStopType={localeStopType}
                    handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                    handleChangeCoordinates={() => {}}
                    draggable={false}
                    belongsToNeighbourStop={true}
                    handleSetCompassBearing={() => {}}
                    showPathLink={!disabled}
                    isEditingStop={isEditingStop}
                    disabled={disabled}
                    currentIsNewStop={currentIsNewStop}
                  />,
                );
              });
            }
          }

        }
      }
    });
    this._popupMarkers = popupMarkers;
  }

  render() {
    return this._popupMarkers;
  }
}

const mapStateToProps = state => ({
  path: state.user.path,
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  currentIsNewStop: getIn(state.stopPlace, ['current', 'isNewStop'], false),
  neighbourStopQuays: state.stopPlace.neighbourStopQuays || {},
  isEditingStop:
    state.routing.locationBeforeTransitions.pathname.indexOf('edit') > -1,
  missingCoordinatesMap: state.user.missingCoordsMap,
  activeMap: state.mapUtils.activeMap,
  pathLink: state.stopPlace.pathLink,
  showExpiredStops: state.stopPlace.showExpiredStops,
  disabled: !getIn(state.roles, ['allowanceInfo', 'canEdit'], false),
  disabledForSearch: !getIn(state.roles, ['allowanceInfoSearchResult', 'canEdit'], false),
  newStopIsMultiModal: state.user.newStopIsMultiModal,
  currentStopIsMultiModal: getIn(state.stopPlace, ['current', 'isParent'], false),
  tokenParsed: getIn(state.roles, ['kc', 'tokenParsed'], null)
});

const getLocaleStopTypeName = (stopPlaceType, intl) => {
  const { formatMessage, locale } = intl;
  let formattedStopTypeId = null;
  stopTypes[locale].forEach(stopType => {
    if (stopType.value === stopPlaceType) {
      formattedStopTypeId = stopType.quayItemName;
    }
  });
  return formattedStopTypeId
    ? formatMessage({ id: formattedStopTypeId || 'name' })
    : '';
};

export default withApollo(injectIntl(connect(mapStateToProps)(MarkerList)));
