import * as types from '../actions/Types'
import formatHelpers from '../modelUtils/mapToClient'


export const initialState = {
  topographicalPlaces: [],
  results: []
}

const reportReducer = (state = initialState, action) => {

  switch (action.type) {

    case 'APOLLO_QUERY_RESULT':

      if (action.operationName === 'TopopGraphicalPlacesForReport') {
        return reduceTopopGraphicalPlacesForReport(state, action)
      } else if (action.operationName === 'findStopForReport') {
        return reduceSearchResultsForReport(state, action)
      } else {
        return state
      }

    default:
      return state
  }
}

const reduceTopopGraphicalPlacesForReport = (state, action) => {
  return Object.assign({}, state, {
    topographicalPlaces: action.result.data.topographicPlace
  })
}

const reduceSearchResultsForReport = (state, action) => {
  return Object.assign({}, state, {
    results: formatHelpers.mapSearchResultatToClientStops(action.result.data.stopPlace)
  })
}


export default reportReducer
