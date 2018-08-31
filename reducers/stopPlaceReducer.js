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


import {
  getStateByOperation,
} from './stopPlaceReducerUtils';
import * as types from '../actions/Types';
import formatHelpers from '../modelUtils/mapToClient';
import limitationHelpers from '../modelUtils/limitationHelpers';
import equipmentHelpers from '../modelUtils/equipmentHelpers';
import AdjacentStopRemover from '../modelUtils/adjacentStopRemover';
import { setDecimalPrecision } from '../utils/';

const stopPlaceReducer = (state = {}, action) => {
  switch (action.type) {

    /* These actions are dispatched by Apollo-Client */
    case types.APOLLO_QUERY_RESULT:
    case types.APOLLO_MUTATION_RESULT:
      return getStateByOperation(state, action);

    case types.CLEAR_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: [],
      });

    case types.REMOVED_CHILD_FROM_PARENT_STOP_PLACE:
      return Object.assign({}, state, {
        current: formatHelpers.updateParenStopWithoutStopPlace(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.ADDED_STOP_PLACES_TO_PARENT:
      return Object.assign({}, state, {
        current: formatHelpers.updateParentStopWithStopPlaces(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.DESTROYED_NEW_STOP:
      return Object.assign({}, state, {
        newStop: null
      });

    case types.NAVIGATE_TO_MAIN_AFTER_DELETE:
      return Object.assign({}, state, {
        searchResults: [],
        pathLink: [],
        current: null,
        stopHasBeenModified: false,
        activeSearchResult: null,
        versions: [],
        originalCurrent: null,
      });

    case types.HID_QUAYS_FOR_NEIGHBOUR_STOP:
      const id = action.payLoad;
      return Object.assign({}, state, {
        neighbourStopQuays: { ...state.neighbourStopQuays, [id]: null },
      });

    case types.RESTORED_TO_ORIGINAL_STOP_PLACE:
      return Object.assign({}, state, {
        stopHasBeenModified: false,
        current: JSON.parse(JSON.stringify(state.originalCurrent)),
        pathLink: JSON.parse(JSON.stringify(state.originalPathLink)),
      });

    case types.ADDED_ADJACENT_CONNECTION:
      return Object.assign({}, state, {
        stopHasBeenModified: true
      });

    case types.REMOVE_ADJACENT_SITE:
      const adjacentStopPlaceRef = action.payLoad.adjacentStopPlaceRef;
      const stopPlaceIdForRemovingAdjacentSite = action.payLoad.stopPlaceId;
      const changedStopPlace = AdjacentStopRemover.removeAdjacentStop(state.current, adjacentStopPlaceRef, stopPlaceIdForRemovingAdjacentSite);

      return Object.assign({}, state, {
        stopHasBeenModified: true,
        current: changedStopPlace
      });

    case types.SET_CENTER_AND_ZOOM:
      return Object.assign({}, state, {
        centerPosition: action.payLoad.position.slice(),
        zoom: action.payLoad.zoom
      });

    case types.CLEAR_LAST_MUTATED_STOP_PLACE_IDS:
      return Object.assign({}, state, {
        lastMutatedStopPlaceId: []
      });

    case types.NAVIGATE_TO:
      if (action.payLoad === '') {
        return Object.assign({}, state, {
          pathLink: [],
          current: null,
          newStop: null
        });
      } else {
        return state
      }

    case types.REMOVED_STOPS_NEARBY_FOR_OVERVIEW:
      return Object.assign({}, state, {
        neighbourStops: [],
      });

    case types.SORTED_QUAYS:
      return Object.assign({}, state, {
        current: formatHelpers.sortQuays(state.current, action.payLoad)
      });

    case types.LOOKUP_COORDINATES:
      return Object.assign({}, state, {
        findCoordinates: {
          position: action.payLoad.position.map(pos => setDecimalPrecision(pos, 6)),
          coordinatePin: true
        },
        centerPosition: action.payLoad.triggeredByDrag ? state.centerPosition : action.payLoad.position,
        zoom: action.payLoad.triggeredByDrag ? state.zoom : 5,
      });

    case types.CHANGED_WEIGHTING_STOP_PLACE:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentStopWithWeighting(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CREATED_NEW_STOP:

      const { location, isMultimodal } = action.payLoad;
      const stopToBeCreated = isMultimodal
        ? formatHelpers.createNewParentStopFromLocation(location)
        : formatHelpers.createNewStopFromLocation(location);

      return Object.assign({}, state, {
        newStop: stopToBeCreated,
        originalCurrent: JSON.parse(JSON.stringify(stopToBeCreated)),
        versions: [],
        pathLink: [],
        newStopIsMultiModal: isMultimodal,
        stopHasBeenModified: false,
      });

    case types.CHANGED_QUAY_COMPASS_BEARING:
      return Object.assign({}, state, {
        current: formatHelpers.updateCompassBearing(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });


    case types.UPDATED_KEY_VALUES_FOR_KEY:
      return Object.assign({}, state, {
        current: formatHelpers.updateKeyValuesByKey(
          state.current,
          action.payLoad.key,
          action.payLoad.values,
          action.payLoad.origin,
        ),
        stopHasBeenModified: true,
      });

    case types.DELETED_KEY_VALUES_BY_KEY:
      return Object.assign({}, state, {
        current: formatHelpers.deleteKeyValuesByKey(
          state.current,
          action.payLoad.key,
          action.payLoad.origin,
        ),
        stopHasBeenModified: true,
      });

    case types.CREATED_KEY_VALUES_PAIR:
      return Object.assign({}, state, {
        current: formatHelpers.createKeyValuesPair(
          state.current,
          action.payLoad.key,
          action.payLoad.values,
          action.payLoad.origin,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_LOCATION_NEW_STOP:
      return Object.assign({}, state, {
        newStop: formatHelpers.createNewStopFromLocation(action.payLoad),
        stopHasBeenModified: true,
      });

    case types.CHANGED_STOP_NAME:
      return {
        ...state,
        current: {
          ...state.current,
          name: action.payLoad,
        },
        stopHasBeenModified: true,
      };

    case types.CHANGED_STOP_DESCRIPTION:
      return {
        ...state,
        current: {
          ...state.current,
          description: action.payLoad,
        },
        stopHasBeenModified: true,
      };

    case types.CHANGED_STOP_TYPE:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentStopWithType(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_STOP_SUBMODE:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentStopWithSubMode(
          state.current,
          action.payLoad.stopPlaceType,
          action.payLoad.transportMode,
          action.payLoad.submode,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_ACTIVE_STOP_POSITION:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentStopWithPosition(
          state.current,
          action.payLoad.location,
        ),
        stopHasBeenModified: true,
      });

    case types.USE_NEW_STOP_AS_CURRENT:
      return Object.assign({}, state, {
        current: JSON.parse(JSON.stringify(state.newStop)),
        centerPosition: state.newStop.location,
        isCreatingPolylines: false,
        zoom: 14,
        stopHasBeenModified: false,
        versions: []
      });

    case types.CREATE_NEW_MULTIMODAL_STOP_FROM_EXISTING:
      const { newStopPlace, fromMain } = action.payLoad;
      let newState = Object.assign({}, state, {
        current: newStopPlace,
        isCreatingPolylines: false,
        stopHasBeenModified: true,
        versions: [],
      });
      if (!fromMain) {
        newState.centerPosition = newStopPlace.location;
      }
      return newState;

    case types.SET_ACTIVE_MARKER:
      return Object.assign({}, state, {
        activeSearchResult: action.payLoad,
        centerPosition: getProperCenterLocation(action.payLoad.location),
        zoom: getProperZoomLevel(action.payLoad.location),
      });

    case types.SET_MISSING_COORDINATES:
      return Object.assign({}, state, {
        centerPosition: getProperCenterLocation(action.payLoad.position),
        zoom: getProperZoomLevel(action.payLoad.position),
        userDefinedCoordinates: action.payLoad,
        activeSearchResult: Object.assign({}, state.activeSearchResult, {
          location: action.payLoad.position,
        }),
      });

    case types.ADDED_JUNCTION_ELEMENT:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithNewElement(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGE_ELEMENT_POSITION:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithElementPositionChange(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGE_PUBLIC_CODE_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithPublicCode(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGE_PRIVATE_CODE_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithPrivateCode(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_ELEMENT_DESCRIPTION:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithElementDescriptionChange(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.REMOVED_ELEMENT_BY_TYPE:
      return Object.assign({}, state, {
        current: formatHelpers.updateCurrentWithoutElement(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });


    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {
        centerPosition: action.payLoad.position,
        zoom: action.payLoad.zoom
      });

    case types.STARTED_CREATING_POLYLINE:
      return Object.assign({}, state, {
        pathLink: formatHelpers.updatePathLinkWithNewEntry(
          action,
          state.pathLink,
        ),
        stopHasBeenModified: true,
        isCreatingPolylines: true,
        enablePolylines: true,
      });

    case types.ADDED_FINAL_COORDINATES_TO_POLYLINE:
      return Object.assign({}, state, {
        pathLink: formatHelpers.updatePathLinkWithNewEntry(
          action,
          state.pathLink,
        ),
        stopHasBeenModified: true,
        isCreatingPolylines: false,
      });

    case types.ADDED_COORDINATES_TO_POLYLINE:
      return Object.assign({}, state, {
        pathLink: formatHelpers.addNewPointToPathlink(action, state.pathLink),
        enablePolylines: true,
      });

    case types.REMOVED_LAST_POLYLINE:
      return Object.assign({}, state, {
        pathLink: state.pathLink.slice(0, state.pathLink.length - 1),
        isCreatingPolylines: false,
      });

    case types.EDITED_TIME_ESTIMATE_FOR_POLYLINE:
      return Object.assign({}, state, {
        pathLink: formatHelpers.updateEstimateForPathLink(
          action,
          state.pathLink,
        ),
      });

    case types.TOGGLED_IS_MULTIPOLYLINES_ENABLED:
      return Object.assign({}, state, { enablePolylines: action.payLoad });

    case types.TOGGLED_IS_COMPASS_BEARING_ENABLED:
      return Object.assign({}, state, {
        isCompassBearingEnabled: action.payLoad,
      });

    case types.TOGGLED_IS_MULTIMODAL_EDGES_ENABLED:
      return Object.assign({}, state, {
        showMultimodalEdges: action.payLoad
      });

    case types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT:
      return Object.assign({}, state, {
        current: limitationHelpers.updateCurrentWithLimitations(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT:
      return Object.assign({}, state, {
        current: limitationHelpers.updateCurrentWithQuayLimitations(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_TICKET_MACHINE_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.updateTicketMachineState(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_SHELTER_EQUIPMENT_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.updateShelterEquipmentState(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_SANITARY_EQUIPMENT_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.updateSanitaryEquipmentState(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_WAITING_ROOM_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.updateWaitingRoomState(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_CYCLE_STORAGE_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.updateCycleStorageEquipmentState(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.CHANGED_TRANSPORT_SIGN_STATE:
      return Object.assign({}, state, {
        current: equipmentHelpers.update512SignEquipment(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.ADDED_ALT_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.addAltName(state.current, action.payLoad),
        stopHasBeenModified: true,
      });

    case types.EDITED_ALT_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.editAltName(state.current, action.payLoad),
        stopHasBeenModified: true,
      });

    case types.REMOVED_ALT_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.removeAltName(state.current, action.payLoad),
        stopHasBeenModified: true,
      });

    case types.CHANGED_PARKING_NAME:
      return Object.assign({}, state, {
        current: formatHelpers.changeParkingName(state.current, action.payLoad),
        stopHasBeenModified: true,
      });

    case types.CHANGED_PARKING_TOTAL_CAPACITY:
      return Object.assign({}, state, {
        current: formatHelpers.changeParkingTotalCapacity(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.OPENED_MERGE_STOP_DIALOG:
      return Object.assign({}, state, {
        mergeStopDialog: {
          isOpen: true,
          ...action.payLoad,
        },
      });

    case types.REQUESTED_QUAYS_MERGE_INFO:
      return Object.assign({}, state, {
         isFetchingMergeInfo: true
     });

    case types.RECEIVED_QUAYS_MERGE_INFO:
      return Object.assign({}, state, {
        isFetchingMergeInfo: false
      });

    case types.CLOSED_MERGE_STOP_DIALOG:
      return Object.assign({}, state, {
        mergeStopDialog: {
          isOpen: false,
        },
      });

    case types.TOGGLED_IS_SHOW_EXPIRED_STOPS:
      return Object.assign({}, state, {
        showExpiredStops: action.payLoad
      });

    case types.SET_ZOOM_LEVEL:
      return Object.assign({}, state, {
        zoom: action.payLoad
      });

    case types.ADDED_TARIFF_ZONE:
      return Object.assign({}, state, {
        current: formatHelpers.addTariffZone(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    case types.REMOVED_TARIFF_ZONE:
      return Object.assign({}, state, {
        current: formatHelpers.removeTariffZone(
          state.current,
          action.payLoad,
        ),
        stopHasBeenModified: true,
      });

    default:
      return state;
  }
};

const getProperCenterLocation = location => {
  return location || [62.928595, 12.083002];
};

const getProperZoomLevel = location => {
  return location ? 15 : 5;
};

export default stopPlaceReducer;
