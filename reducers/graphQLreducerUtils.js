import formatHelpers from '../modelUtils/mapToClient'

export const getStateByOperation = (state, action) => {

  switch (action.operationName) {
    case 'stopPlace':
      return getStopFromResult(state, action)

    case 'mutateStopPlace':

      if (!action.result.data.mutateStopPlace) return state

      const mutatedStopPlace = action.result.data.mutateStopPlace[0]

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        minZoom: mutatedStopPlace.location ? 14 : 5,
        centerPosition: formatHelpers.mapLocationToPosition(mutatedStopPlace.location) || state.centerPosition
      })

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
      })

    case 'findStop':
      return Object.assign({}, state, {
        searchResults: formatHelpers.mapSearchResultatToClientStops(action.result.data.stopPlace),
      })

    default: return state
  }

}


export const getObjectFromCache = (state, action) => {
  return getStopFromResult(state, action)
}

const getProperZoomLevel = location => {
  return location ? 15 : 5
}

const getStopFromResult = (state, action) => {

  if (!action.result.data.stopPlace) {
    return state
  }

  const stopPlace = action.result.data.stopPlace[0]

  return Object.assign({}, state, {
    current: formatHelpers.mapStopToClientStop(stopPlace, true),
    zoom: getProperZoomLevel(stopPlace.location),
    minZoom: stopPlace.location ? 14 : 7,
    centerPosition: formatHelpers.mapLocationToPosition(stopPlace.location) || state.centerPosition
  })
}