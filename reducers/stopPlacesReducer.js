import * as types from './../actions/actionTypes'

export const intialState = {
  centerPosition: {
    lat: 61.670029,
    lng: 6.4423426500000005
  },
  activeMarkers: [],
  zoom: 7,
  dataSource: [],
  stopPlaceNames: {
    isLoading: false,
    errorMessage: '',
    places: []
  },
  activeStopPlace: {}
}

const stopPlacesReducer = (state = intialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {centerPosition: action.payLoad})

    case types.SET_ACTIVE_MARKERS:
      return Object.assign({}, state, {activeMarkers: [action.payLoad]})

    case types.SET_ZOOM:
      return Object.assign({}, state, {zoom: action.payLoad})

    case types.RECEIVED_DATASOURCE:
      return Object.assign({}, state, {dataSource: action.payLoad})

    case types.REQUESTED_STOP_NAMES:
      return Object.assign({}, state, { stopPlaceNames: { isLoading: true } } )

    case types.RECEIVED_STOP_NAMES:
      const bitch =  Object.assign({}, state, {  stopPlaceNames: { places: action.payLoad } } )
      return bitch

    case types.ERROR_STOP_NAMES:
      return Object.assign({}, state, { stopPlaceNames: { errorMessage: action.payLoad } } )

    // console.warn("stopPlacesReducer: Unhandled type", action.type)

    default:
      return state
  }
}

export default stopPlacesReducer
