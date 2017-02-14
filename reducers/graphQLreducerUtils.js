import formatHelpers from '../modelUtils/mapToClient'

export const getStateByOperation = (state, action) => {

  switch (action.operationName) {
    case 'stopPlace':

      if (!action.result.data.stopPlace) return state

      const stopPlace = action.result.data.stopPlace[0]

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(stopPlace, true),
        zoom: stopPlace.location ? 14 : 5,
        centerPosition: formatHelpers.mapLocationToPosition(stopPlace.location)
      })

    case 'mutateStopPlace':

      if (!action.result.data.mutateStopPlace) return state

      const mutatedStopPlace = action.result.data.mutateStopPlace[0]

      console.log("mutatedStoPlace", mutatedStopPlace)

      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(mutatedStopPlace, true),
        zoom: mutatedStopPlace.location ? 14 : 5,
        centerPosition: formatHelpers.mapLocationToPosition(mutatedStopPlace.location)
      })

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
      })

    case 'findStop':
      return Object.assign({}, state, {
        searchResults: formatHelpers.mapSearchResultatToClientStops(action.result.data.stopPlace)
      })

    default: return state
  }

}