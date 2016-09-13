import * as types from './../actions/actionTypes'

const intialState = {
  centerPosition: {
    lat: 61.670029,
    lng: 6.4423426500000005,
  },
  activeMarkers: [],
  zoom: 7
}

const mapReducer = (state = intialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {centerPosition: action.payLoad})

    case types.SET_ACTIVE_MARKERS:
      return Object.assign({}, state, {activeMarkers: [action.payLoad]})

    case types.SET_ZOOM:
      return Object.assign({}, state, {zoom: action.payLoad})

    default:
      return state
  }
}

export default mapReducer
