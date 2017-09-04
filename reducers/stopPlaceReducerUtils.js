import formatHelpers from '../modelUtils/mapToClient';

export const getStateByOperation = (state, action) => {
  switch (action.operationName) {
    case 'stopPlace':
    case 'updateChildOfParentStop':
    case 'stopPlaceAndPathLink':
      return getDataFromResult(state, action);

    case 'stopPlaceAllVersions':
      return Object.assign({}, state, {
        versions: getAllVersionFromResult(state, action),
        stopHasBeenModified: false
      });

    case 'mutateDeleteQuay':
      if (!action.result.data.deleteQuay) return state;

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(
          action.result.data.deleteQuay,
          true
        ),
        originalCurrent: formatHelpers.mapStopToClientStop(
          action.result.data.deleteQuay,
          true
        ),
        minZoom: action.result.data.deleteQuay.geometry ? 14 : 5,
        centerPosition:
          formatHelpers.getCenterPosition(
            action.result.data.deleteQuay.geometry
          ) || state.centerPosition
      });

    case 'mutateStopPlace':
      if (!action.result.data.mutateStopPlace) return state;

      const mutatedStopPlace = action.result.data.mutateStopPlace[0];

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        originalCurrent: formatHelpers.mapStopToClientStop(
          mutatedStopPlace,
          true
        ),
        isCreatingPolylines: false,
        minZoom: mutatedStopPlace.geometry ? 14 : 5,
        centerPosition:
          formatHelpers.getCenterPosition(mutatedStopPlace.geometry) ||
            state.centerPosition
      });

    case 'mutateParentStopPlace':
      if (!action.result.data.mutateParentStopPlace) return state;

      const mutatedParentStopPlace =
        action.result.data.mutateParentStopPlace[0];

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(
          mutatedParentStopPlace,
          true
        ),
        originalCurrent: formatHelpers.mapStopToClientStop(
          mutatedParentStopPlace,
          true
        ),
        isCreatingPolylines: false,
        minZoom: mutatedParentStopPlace.geometry ? 14 : 5,
        centerPosition:
          formatHelpers.getCenterPosition(mutatedParentStopPlace.geometry) ||
            state.centerPosition
      });

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(
          action.result.data.stopPlaceBBox
        )
      });

    case 'mutatePathLink':
      return Object.assign({}, state, {
        pathLink: formatHelpers.mapPathLinkToClient(
          action.result.data.mutatePathlink
        ),
        originalPathLink: formatHelpers.mapPathLinkToClient(
          action.result.data.mutatePathlink
        )
      });

    case 'findStop':
      return Object.assign({}, state, {
        searchResults: formatHelpers.mapSearchResultatToClientStops(
          action.result.data.stopPlace
        )
      });

    case 'mutateParking':
      let stopPlaceWithParking = Object.assign({}, state.current, {
        parking: formatHelpers.mapParkingToClient(
          action.result.data.mutateParking
        )
      });

      return Object.assign({}, state, {
        current: stopPlaceWithParking
      });

    case 'neighbourStopPlaceQuays':
      return Object.assign({}, state, {
        neighbourStopQuays: formatHelpers.mapNeighbourQuaysToClient(
          state.neighbourStopQuays,
          action.result.data.stopPlace
        )
      });

    case 'TopopGraphicalPlaces':
      return Object.assign({}, state, {
        topographicalPlaces: action.result.data.topographicPlace
      });

    default:
      return state;
  }
};

const getProperZoomLevel = (data, prevZoom) => {
  if (!data || data.location) return 5;
  if (prevZoom > 15) return prevZoom;
  return 15;
};

const getDataFromResult = (state, action) => {
  if (!action.result.data) {
    return state;
  }

  if (action.result.data.stopPlaceBBox) {
    return Object.assign({}, state, {
      neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(
        action.result.data.stopPlaceBBox
      )
    });
  }

  let stopPlace = action.result.data.stopPlace &&
    action.result.data.stopPlace.length
    ? action.result.data.stopPlace[0]
    : null;

  if (!stopPlace) {
    if (
      action.result.data.mutateParentStopPlace &&
      action.result.data.mutateParentStopPlace.length
    ) {
      stopPlace = action.result.data.mutateParentStopPlace[0];
    }
  }

  if (stopPlace === null) {
    return state;
  }

  const pathLink = action.result.data.pathLink
    ? action.result.data.pathLink
    : [];

  const parking = action.result.data.parking ? action.result.data.parking : [];

  const resourceId = extractResourceId(action);

  const currentStop = formatHelpers.mapStopToClientStop(
    stopPlace,
    true,
    formatHelpers.mapParkingToClient(parking),
    state.userDefinedCoordinates,
    resourceId
  );
  const originalCurrentStop = JSON.parse(JSON.stringify(currentStop));

  return Object.assign({}, state, {
    current: currentStop,
    versions: getAllVersionFromResult(state, action),
    originalCurrent: originalCurrentStop,
    originalPathLink: formatHelpers.mapPathLinkToClient(pathLink),
    zoom: getProperZoomLevel(stopPlace, state.zoom),
    minZoom: stopPlace && stopPlace.geometry ? 14 : 7,
    pathLink: formatHelpers.mapPathLinkToClient(pathLink),
    neighbourStopQuays: {},
    centerPosition: !stopPlace || !stopPlace.geometry
      ? state.centerPosition
      : formatHelpers.getCenterPosition(stopPlace.geometry),
    stopHasBeenModified: false,
    isCreatingPolylines: false
  });
};

const getAllVersionFromResult = (state, action)   => {

  const idFromVariables = action.variables.id;

  const data = action.result.data.versions && action.result.data.versions.length
    ? action.result.data.versions
    : null;

  let correctData = [];

  if (data && data.length) {
    const idFromTopLevel = data[0].id;
    // get versions of parent stop or normal stop place
    if (idFromTopLevel === idFromVariables) {
      correctData = data;
    } else {
      // get versions from parent stop place structure by inspecting its children
      correctData = data.map( item => {
        if (item.children) {
          for (let i = 0; i < item.children; i++) {
            let child = item.children[i];
            if (child.id === idFromVariables) {
              return child;
            }
          }
        }
      });
    }

  }

  return formatHelpers.mapVersionToClientVersion(correctData);
};

/* determine whether mutation result was intended for a parentStopPlace or child of a parentStopPlace
since body always will be full parentStopPlace */
const extractResourceId = action => {
  if (!action || !action.variables) return null;

  if (
    action.operationName === 'updateChildOfParentStop' &&
    action.variables.children &&
    action.variables.children.length
  ) {
    return action.variables.children[0].id;
  }

  return action.variables.id;
};
