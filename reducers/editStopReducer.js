import * as types from './../actions/actionTypes'

const initialState = {
  centerPosition: {
    lat: 67.928595,
    lng: 13.0830025,
  },
  activeMarkers: [],
  zoom: 17,
  activeStopIsLoading: false
}

const editStopReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {centerPosition: action.payLoad})

    case types.SET_ACTIVE_MARKERS:
      return Object.assign({}, state, {activeMarkers: [action.payLoad]})

    case types.RECEIVED_STOP:
      const stop = Object.assign({}, state, { activeStopIsLoading: false, activeStopPlace: action.payLoad })
      return stop
    case types.REQUESTED_STOP:
      return Object.assign({}, state, { activeStopIsLoading: true})

    case types.ERROR_STOP:
      return Object.assign({}, state, { activeStopIsLoading: false})

    case types.ADDED_NEW_QUAY:
      let markerToExpand = Object.assign({}, state.activeStopPlace[0], {})
      let newQuay = {
        name: "",
        shortName: "",
        description: "",
        centroid: {
          location: {
            longitude: markerToExpand.markerProps.position[1] + ( Math.floor((Math.random() * 10) + 1) / 10000),
            latitude: markerToExpand.markerProps.position[0] + ( Math.floor((Math.random() * 10) + 1) / 10000 )
          }
        },
        allAreasWheelchairAccessible: false,
        quayType: 'other',
        new: true
      }

      markerToExpand.markerProps.quays.push(newQuay)
      return Object.assign({}, state, {activeStopPlace: [markerToExpand]})

    case types.REMOVED_QUAY:
      let markerToReduce = Object.assign({}, state.activeStopPlace[0], {})
      markerToReduce.markerProps.quays.splice(action.payLoad,1)

      return Object.assign({}, state, {activeStopPlace: [markerToReduce]})

    case types.CHANGED_QUAY_NAME:
      let markerToChangeQN = Object.assign({}, state.activeStopPlace[0],{})
      markerToChangeQN.markerProps.quays[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {activeStopPlace: [markerToChangeQN]})

    case types.CHANGED_QUAY_DESCRIPTION:
      let markerToChangeQD = Object.assign({}, state.activeStopPlace[0],{})
      markerToChangeQD.markerProps.quays[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {activeStopPlace: [markerToChangeQD]})

    case types.CHANGED_QUAY_TYPE:
      let markerToChangeQT = Object.assign({}, state.activeStopPlace[0],{})
      markerToChangeQT.markerProps.quays[action.payLoad.index].quayType = action.payLoad.type

      return Object.assign({}, state, {activeStopPlace: [markerToChangeQT]})

    case types.CHANGED_WHA:
      let markerToChangeWHA = Object.assign({}, state.activeStopPlace[0],{})
      markerToChangeWHA.markerProps.quays[action.payLoad.index].allAreasWheelchairAccessible = action.payLoad.value

      return Object.assign({}, state, {activeStopPlace: [markerToChangeWHA]})

    case types.CHANGED_QUAY_POSITION:

      let stopIndex = action.payLoad.stopIndex
      let markerIndex = action.payLoad.markerIndex
      let location = [action.payLoad.position.lat, action.payLoad.position.lng]

      let activeStopPlacesQP = state.activeStopPlace.slice(0)

      if (markerIndex >= 0) {

        activeStopPlacesQP[stopIndex].markerProps.quays[markerIndex].centroid.location = {
          latitude: location[0],
          longitude: location[1]
        }

      } else {
        activeStopPlacesQP[stopIndex].markerProps.position = location
      }

      return Object.assign({}, state, {activeStopPlace: activeStopPlacesQP})

    case types.RECEIVED_STOPS_NEARBY:
      return Object.assign({}, state, {activeStopPlace: state.activeStopPlace.concat(action.payLoad)})

    default:
      return state
  }
}

export default editStopReducer
