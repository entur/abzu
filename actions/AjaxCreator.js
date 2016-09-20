import suggestions from '../config/restMock.js'
import * as types from './actionTypes'
import axios from 'axios'

var AjaxCreator = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

AjaxCreator.getStopNames = (filter) => {

  return function(dispatch) {

    const URL = 'http://localhost:1888/jersey/stop_place/?name=' + filter

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

const formatMarkers = (data) => {

  const suggestions = data.map ( (stop, index) => {

    return {
      text: `${stop.name}, ${stop.municipality} (${stop.county})`,
      value: stop.id,
      position: {
        lng: stop.centroid.location.longitude,
        lat: stop.centroid.location.latitude
      },
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

AjaxCreator.getStop = (stopId) => {

  return function(dispatch) {

    const URL = 'http://localhost:1888/jersey/stop_place/' + stopId

    dispatch( sendData(types.REQUESTED_STOP, null) )

    return axios.get(URL)
    .then(function(response) {
      const suggestions = formatMarkers([response.data])
      dispatch( sendData(types.RECEIVED_STOP, suggestions) )
    })
    .catch(function(response){
      dispatch( sendData(types.ERROR_STOP, response.data) )
    })

  }

}

const prepareStopForSaving = (original) => {

  let stop = Object.assign({}, original, {})
  let savableStop = {}

  savableStop.name = stop.markerProps.name
  savableStop.shortName = null // TODO: Is this used?
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
    savableStop.quays = stop.markerProps.quays.map ( (map) => {
      delete map.new
      return map
    })
  }

  return savableStop
}

AjaxCreator.saveEditingStop = () => {

  return function(dispatch, getState) {

    const stop = getState().editStopReducer.activeStopPlace[0]

    if (!stop) {
      console.error('Did not find stop to save')
      return
    }

    const URL = 'http://localhost:1888/jersey/stop_place/' + stop.markerProps.id

    var savableStop = prepareStopForSaving(stop)

    return axios.post(URL, savableStop)
    .then(function(response) {
      dispatch( sendData(types.SUCCESS_STOP_SAVED, response.data) )
      dispatch( sendData(types.UNLIST_QUAYS_AS_NEW, response.data) )
    })
    .catch(function(response){
      dispatch( sendData(types.ERROR_STOP_SAVED, response.data) )
    })

  }
}



export default AjaxCreator
