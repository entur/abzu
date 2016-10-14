import * as types from './actionTypes'
import UserActions from './UserActions'
import axios from 'axios'

var AjaxActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

 AjaxActions.getStopNames = (name) => {

  return function(dispatch, getState) {

    let URL = window.config.tiamatBaseUrl + 'stop_place/'
    const state = getState()
    const stopTypeFilters = state.userReducer.searchFilters.stopType

    let queryParams = ''

    if (name.length) {
      queryParams += '?name=' + name
    }

    if (stopTypeFilters && stopTypeFilters.length) {
      queryParams += stopTypeFilters.map( (type) => `&stopPlaceType=${type}`).join('')
    }

    const topoiChips = state.userReducer.searchFilters.topoiChips

    let countyRefParams = ''
    let municipalityRefParams = ''

    topoiChips.forEach( (t) => {
      if (t.type === 'county') {
        countyRefParams += `&countyReference=${t.ref}`
      } else {
        municipalityRefParams += `&municipalityReference=${t.ref}`
      }
    })

    queryParams += countyRefParams + municipalityRefParams

    if (!queryParams.length) {
      return
    }

    dispatch( sendData(types.REQUESTED_STOP_NAMES, null) )

    return axios.get(URL+queryParams)
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

    const URL =  window.config.tiamatBaseUrl + 'stop_place/search'

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

export const formatMarkers = (data) => {

  try {

    return data.map ( (stop, index) => {

      let suggestion = {
        text: '<<>>',
        value: stop.id,
        markerProps: {
          key: `marker${index}`,
          name: stop.name || '',
          id: stop.id,
          position: [stop.centroid.location.latitude, stop.centroid.location.longitude],
          children: stop.name,
          description: stop.description || '',
          municipality: stop.municipality,
          county: stop.county,
          quays: stop.quays,
          stopPlaceType: stop.stopPlaceType
        }
      }

      if (stop.name) {
        suggestion.text = stop.name
      }

      if (stop.municipality && stop.county) {
        suggestion.text += `, ${stop.municipality} (${stop.county})`
      }

      return suggestion

    })

  } catch (e) {
    console.error('error formating markers', e)
    return []
  }
}

 AjaxActions.getStop = (stopId) => {

  return function(dispatch, getState) {

    if (stopId !== 'new_stop') {
      const URL = window.config.tiamatBaseUrl + 'stop_place/' + stopId

      dispatch( sendData(types.REQUESTED_STOP, null) )

      return axios.get(URL)
      .then(function(response) {
        dispatch( sendData(types.RECEIVED_STOP, formatMarkers([response.data])))
        dispatch( sendData(types.CHANGED_MAP_CENTER, stops[0].markerProps.position) )
        dispatch( sendData(types.SET_ZOOM, 15) )
      })
      .catch(function(response){
        dispatch( sendData(types.ERROR_STOP, response.data) )
      })
    } else {

      const state = getState()

      // caused by hard-reload, return to main screen
      if (!state.stopPlacesReducer.newStopPlace) {
        dispatch( UserActions.navigateTo('/',''))
        return
      }

      const newStop = Object.assign({}, state.stopPlacesReducer.newStopPlace, {})
      delete newStop.isNewStop

      dispatch( sendData(types.RECEIVED_STOP, [newStop]) )
      dispatch( sendData(types.CHANGED_MAP_CENTER, newStop.markerProps.position) )
      dispatch( sendData(types.SET_ZOOM, 15) )
    }
  }

}

export const prepareStopForSaving = (stop) => {

  let savableStop = {}

  savableStop.name = stop.markerProps.name
  savableStop.description = stop.markerProps.description
  savableStop.id = stop.markerProps.id
  savableStop.centroid = {}
  savableStop.centroid.location = {
    latitude: stop.markerProps.position[0],
    longitude: stop.markerProps.position[1],
  }
  savableStop.allAreasWheelchairAccessible = false
  savableStop.stopPlaceType = stop.markerProps.stopPlaceType
  savableStop.municipality = stop.markerProps.municipality
  savableStop.county = stop.markerProps.county
  savableStop.quays = []

  if (stop.markerProps.quays) {
    stop.markerProps.quays.forEach ( (quay) => {
      delete quay.new
      quay.type = ''
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

    const URL = window.config.tiamatBaseUrl + 'stop_place/' + stop.markerProps.id

    var savableStop = prepareStopForSaving(stop)
    return axios.post(URL, savableStop)
    .then(function(response) {
      dispatch( sendData(types.SUCCESS_STOP_SAVED, response.data) )
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED))
      dispatch( sendData(types.RECEIVED_STOP, formatMarkers([response.data])) )
    })
    .catch(function(response){
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED))
      dispatch( sendData(types.ERROR_STOP_SAVED, response.data) )
    })

  }
}

AjaxActions.saveNewStop = () => {
  return function(dispatch, getState) {

    var stop = {...getState().stopPlacesReducer.newStopPlace}

    if (!stop) {
      console.error('Did not find stop to save')
      return
    }

    const URL = window.config.tiamatBaseUrl + 'stop_place/'

    var savableStop = prepareStopForSaving(stop)
    return axios.post(URL, savableStop)
    .then(function(response) {
      dispatch( sendData(types.SUCCESS_STOP_SAVED, response.data) )
      dispatch( sendData(types.RECEIVED_STOP, formatMarkers([response.data])) )
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED))
      dispatch ( UserActions.navigateTo('/edit/', response.data.id) )
    })
    .catch(function(response){
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED))
      dispatch( sendData(types.ERROR_STOP_SAVED, response.data) )
    })
  }
}

AjaxActions.populateTopograhicalPlaces = () => {
  return function(dispatch) {
    const URL = window.config.tiamatBaseUrl + 'topographic_place/'
    return axios.get(URL)
    .then(function(response) {
      dispatch( sendData(types.RECEIVED_TOPOGRAPHICAL_PLACES, response.data))
    })
    .catch(function(response) {
      console.error('Unable to populate topopgraphical places')
    })
  }
}

export default AjaxActions
