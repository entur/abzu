import formatHelpers from '../modelUtils/mapToClient'

export const getStateByOperation = (state, action) => {

  switch (action.operationName) {
    case 'stopPlace':

      if (!action.result.data.stopPlace) return state

      const stopPlace = action.result.data.stopPlace[0]

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(stopPlace, true),
        zoom: getProperZoomLevel(stopPlace.location),
        minZoom: stopPlace.location ? 15 : 5,
        centerPosition: formatHelpers.mapLocationToPosition(stopPlace.location) || state.centerPosition
      })

    case 'mutateStopPlace':

      if (!action.result.data.mutateStopPlace) return state

      const mutatedStopPlace = action.result.data.mutateStopPlace[0]

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        minZoom: mutatedStopPlace.location ? 15 : 5,
        centerPosition: formatHelpers.mapLocationToPosition(mutatedStopPlace.location) || state.centerPosition
      })

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
      })

    case 'findStop':
      const foundStop = action.result.data.stopPlace
      return Object.assign({}, state, {
        searchResults: formatHelpers.mapSearchResultatToClientStops(foundStop),
      })

    default: return state
  }

}

const getProperZoomLevel = location => {
  return location ? 15 : 8
}