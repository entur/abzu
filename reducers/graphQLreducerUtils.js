import formatHelpers from '../actions/formatHelpers'

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

    case 'stopPlaceBBox':
      return Object.assign({}, state, {
        neighbourStops: formatHelpers.mapNeighbourStopsToClientStops(action.result.data.stopPlaceBBox)
      })

    default: return state
  }

}