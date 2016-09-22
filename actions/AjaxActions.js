import * as types from './actionTypes'
import axios from 'axios'

var AjaxActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

 AjaxActions.getStopNames = (filter) => {

  return function(dispatch) {

    const URL = window.config.tiamatBaseUrl + 'jersey/stop_place/?name=' + filter

    dispatch( sendData(types.REQUESTED_STOP_NAMES, null) )

    return axios.get(URL)
    .then(function(response) {
      const suggestions = formatMarkers(response.data)
      dispatch( sendData(types.RECEIVED_STOP_NAMES, suggestions) )
    })
    .catch(function(response){
      dispatch( sendData(types.ERROR_STOP_NAMES, response.data) )
    })

  }
}

 AjaxActions.getStopsNearby = (boundingBox, ignoreStopPlaceId) => {

  return function(dispatch) {

    const URL =  window.config.tiamatBaseUrl + 'jersey/stop_place/search'

    let payLoad = {
      boundingBox: boundingBox,
      ignoreStopPlaceId: ignoreStopPlaceId
    }

    return axios.post(URL, payLoad)
    .then(function(response) {
      dispatch (sendData(types.RECEIVED_STOPS_NEARBY, formatMarkers(response.data)))
    })
    .catch(function(response) {
      dispatch (sendData(types.ERROR_STOPS_NEARBY, response.data))
    })

  }
}

const formatMarkers = (data) => {

  const suggestions = data.map ( (stop, index) => {

    return {
      text: `${stop.name}, ${stop.municipality} (${stop.county})`,
      value: stop.id,
      markerProps: {
        key: `marker${index}`,
        name: stop.name,
        id: stop.id,
        position: [stop.centroid.location.latitude, stop.centroid.location.longitude],
        children: stop.name,
        description: stop.description,
        municipality: stop.municipality,
        county: stop.county,
        quays: stop.quays
      }
    }
  })

  return suggestions
}

 AjaxActions.getStop = (stopId) => {

  return function(dispatch) {

    const URL = window.config.tiamatBaseUrl + 'jersey/stop_place/' + stopId

    dispatch( sendData(types.REQUESTED_STOP, null) )

    return axios.get(URL)
    .then(function(response) {
      const stops = formatMarkers([response.data])
      dispatch( sendData(types.RECEIVED_STOP, stops) )
      dispatch( sendData(types.CHANGED_MAP_CENTER, stops[0].markerProps.position) )
      dispatch( sendData(types.SET_ZOOM, 15) )
    })
    .catch(function(response){
      dispatch( sendData(types.ERROR_STOP, response.data) )
    })

  }

}

const prepareStopForSaving = (stop) => {

  let savableStop = {}

  savableStop.name = stop.markerProps.name
  savableStop.description = stop.markerProps.description
  savableStop.id = stop.markerProps.id
  savableStop.centroid = {}
  savableStop.centroid.location = {
    latitude: stop.markerProps.position[0],
    longitude: stop.markerProps.position[1],
  }
  savableStop.allAreasWheelchairAccessible = false // TODO: Used?
  savableStop.stopPlaceType = null // TODO : support this
  savableStop.municipality = stop.markerProps.municipality
  savableStop.county = stop.markerProps.county

  if (stop.markerProps.quays) {
    savableStop.quays = []
    stop.markerProps.quays.forEach ( (quay) => {
      delete quay.new
      savableStop.quays.push(quay)
    })
  }

  return savableStop
}

 AjaxActions.saveEditingStop = () => {

  return function(dispatch, getState) {

    var stop = {...getState().editStopReducer.activeStopPlace[0]}

    if (!stop) {
      console.error('Did not find stop to save')
      return
    }

    const URL = window.config.tiamatBaseUrl + 'jersey/stop_place/' + stop.markerProps.id

    var savableStop = prepareStopForSaving(stop)
    return axios.post(URL, savableStop)
    .then(function(response) {
      dispatch( sendData(types.SUCCESS_STOP_SAVED, response.data) )
      dispatch( sendData(types.RECEIVED_STOP, formatMarkers([response.data])) )
    })
    .catch(function(response){
      dispatch( sendData(types.ERROR_STOP_SAVED, response.data) )
    })

  }
}


export default AjaxActions
