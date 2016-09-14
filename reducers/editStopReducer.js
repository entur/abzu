import * as types from './../actions/actionTypes'

const intialState = {
  centerPosition: {
    lat: 67.928595,
    lng: 13.0830025,
  },
  activeMarkers: [],
  zoom: 17,
  lastUpdated: Date.now()
}

const editStopReducer = (state = intialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {centerPosition: action.payLoad})

    case types.SET_ACTIVE_MARKERS:
      return Object.assign({}, state, {activeMarkers: [action.payLoad]})

    case types.UPDATE_MAP:
      return Object.assign({}, state, {lastUpdated: action.payLoad})

    default:
      return state
  }
}

export default editStopReducer
