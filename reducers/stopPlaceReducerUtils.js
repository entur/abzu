import formatHelpers from '../modelUtils/mapToClient'

export const getStateByOperation = (state, action) => {

  switch (action.operationName) {

    case 'stopPlace':
    case 'stopPlaceAndPathLink':
      return getDataFromResult(state, action)

    case 'stopPlaceAllVersions':
      return Object.assign({}, state, {
        versions: getAllVersionFromResult(state, action),
        stopHasBeenModified: false
      })

    case 'mutateStopPlace':

      if (!action.result.data.mutateStopPlace) return state

      const mutatedStopPlace = action.result.data.mutateStopPlace[0]

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        originalCurrent: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        minZoom: mutatedStopPlace.geometry ? 14 : 5,
        centerPosition: formatHelpers.getCenterPosition(mutatedStopPlace.geometry) || state.centerPosition
      })

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
      })

    case 'mutatePathLink':
      return Object.assign({}, state, {
        pathLink: formatHelpers.mapPathLinkToClient(action.result.data.mutatePathlink),
        originalPathLink: formatHelpers.mapPathLinkToClient(action.result.data.mutatePathlink)
      })

    case 'findStop':
      return Object.assign({}, state, {
        searchResults: formatHelpers.mapSearchResultatToClientStops(action.result.data.stopPlace),
      })

    case 'neighbourStopPlaceQuays':
      return Object.assign({}, state, {
        neighbourStopQuays: formatHelpers.mapNeighbourQuaysToClient(state.neighbourStopQuays, action.result.data.stopPlace)
      })

    case 'TopopGraphicalPlaces':
      return Object.assign({}, state, {
        topographicalPlaces: action.result.data.topographicPlace
      })

    default: return state
  }
}

export const getObjectFromCache = (state, action) => {
  return getDataFromResult(state, action)
}

const getProperZoomLevel = data => {
  if (!data || data.location) return 5
  return 15
}

const getDataFromResult = (state, action) => {

  if (!action.result.data) {
    return state
  }

  if (action.result.data.stopPlaceBBox) {
    return Object.assign({}, state, {
      neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
    })
  }

  const stopPlace = ( action.result.data.stopPlace && action.result.data.stopPlace.length)
    ? action.result.data.stopPlace[0]
    : null

  const pathLink = action.result.data.pathLink
    ? action.result.data.pathLink
    : []

  const parking = action.result.data.parking
    ? action.result.data.parking
    : []

  return Object.assign({}, state, {
    current: formatHelpers.mapStopToClientStop(stopPlace, true, formatHelpers.mapParkingToClient(parking)),
    versions: getAllVersionFromResult(state, action),
    originalCurrent: formatHelpers.mapStopToClientStop(stopPlace, true, formatHelpers.mapParkingToClient(parking)),
    originalPathLink: formatHelpers.mapPathLinkToClient(pathLink),
    zoom: getProperZoomLevel(stopPlace),
    minZoom: (stopPlace && stopPlace.geometry) ? 14 : 7,
    pathLink: formatHelpers.mapPathLinkToClient(pathLink),
    neighbourStopQuays: {},
    centerPosition: (!stopPlace || !stopPlace.geometry) ? state.centerPosition : formatHelpers.getCenterPosition(stopPlace.geometry),
    stopHasBeenModified: false
  })
}

const getAllVersionFromResult = (state, action) => {
  const data = ( ( action.result.data.versions && action.result.data.versions.length)
    ? action.result.data.versions
    : null)
  return formatHelpers.mapVersionToClientVersion(data)
}
