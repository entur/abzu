import * as types from './../actions/actionTypes'

const initialState = {
  centerPosition: [
    "67.928595",
    "13.0830025",
  ],
  neighbouringMarkers: [],
  zoom: 17,
  activeStopIsLoading: false,
  editedStopChanged: false,
  activeStopPlaceOriginal: [],
  activeStopPlace: null,
  neighbouringMarkers: []
}

const editStopReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, { centerPosition: action.payLoad })

    case types.RECEIVED_STOP:
      const original = JSON.parse(JSON.stringify(action.payLoad))
      return Object.assign({}, state, {
        activeStopPlaceOriginal: original,
        editedStopChanged: false,
        activeStopIsLoading: false,
        activeStopPlace: action.payLoad
      })

    case types.REQUESTED_STOP:
      return Object.assign({}, state, { activeStopIsLoading: true})

    case types.ERROR_STOP:
      return Object.assign({}, state, { activeStopIsLoading: false})

    case types.ADDED_NEW_QUAY:
      let markerToExpand = Object.assign({}, state.activeStopPlace, {})

      let newQuay = {
        name: "",
        shortName: "",
        description: "",
        centroid: {
          location: {
            latitude: markerToExpand.markerProps.position[0] + ( Math.floor((Math.random() * 10) + 1) / 10000 ),
            longitude: markerToExpand.markerProps.position[1] + ( Math.floor((Math.random() * 10) + 1) / 10000)
          }
        },
        allAreasWheelchairAccessible: false,
        quayType: 'other',
        new: true
      }

      markerToExpand.markerProps.quays.push(newQuay)

      return Object.assign({}, state, { editedStopChanged: true, activeStopPlace: markerToExpand})

    case types.REMOVED_QUAY:
      let markerToReduce = Object.assign({}, state.activeStopPlace, {})
      markerToReduce.markerProps.quays.splice(action.payLoad,1)

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToReduce})

    case types.CHANGED_QUAY_NAME:
      let markerToChangeQN = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQN.markerProps.quays[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQN})

    case types.CHANGED_QUAY_DESCRIPTION:
      let markerToChangeQD = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQD.markerProps.quays[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQD})

    case types.CHANGED_WHA:
      let markerToChangeWHA = Object.assign({}, state.activeStopPlace,{})
      markerToChangeWHA.markerProps.quays[action.payLoad.index].allAreasWheelchairAccessible = action.payLoad.value

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeWHA})

    case types.CHANGED_QUAY_POSITION:

      let quayIndex = action.payLoad.quayIndex

      let activeStopPlacesQP = {...state.activeStopPlace}

      activeStopPlacesQP.markerProps.quays[quayIndex].centroid.location = {
          latitude: action.payLoad.position.lat,
          longitude: action.payLoad.position.lng
      }

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlacesQP})

    case types.CHANGED_ACTIVE_STOP_POSITION:
      let activeStopPlacesASP = {...state.activeStopPlace}
      const { position } = action.payLoad
      activeStopPlacesASP.markerProps.position = [position.lat, position.lng]

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlacesASP})

    case types.RECEIVED_STOPS_EDITING_NEARBY:
      return Object.assign({}, state, {neighbouringMarkers: action.payLoad})

    case types.CHANGED_STOP_NAME:
      let activeStopPlaceCSN = {...state.activeStopPlace}
      activeStopPlaceCSN.markerProps.name = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCSN})

    case types.CHANGED_STOP_DESCRIPTION:
      let activeStopPlaceCSD = {...state.activeStopPlace}
      activeStopPlaceCSD.markerProps.description = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCSD})

    case types.CHANGED_STOP_TYPE:
      let activeStopPlaceCST = {...state.activeStopPlace}
      activeStopPlaceCST.markerProps.stopPlaceType = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCST})

    case types.RESTORED_TO_ORIGINAL_STOP_PLACE:
      const originalCopy = JSON.parse(JSON.stringify(state.activeStopPlaceOriginal))
      return Object.assign({}, state, { editedStopChanged: false, activeStopPlace: originalCopy })

    default:
      return state
  }
}

export default editStopReducer
