import * as types from './actionTypes'
import UserActions from './UserActions'
import axios from 'axios'
import { setDecimalPrecision } from '../utils'

var AjaxActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

 AjaxActions.getStopNames = (name) => {

  const thunk = function(dispatch, getState) {

    let URL = window.config.tiamatBaseUrl + 'stop_place/'
    const state = getState()
    const stopTypeFilters = state.userReducer.searchFilters.stopType

    let queryParams = []

    if (name.length) {
      queryParams.push('q=' + name)
    }

    if (stopTypeFilters && stopTypeFilters.length) {
      Array.prototype.push.apply(queryParams, stopTypeFilters.map( (type) => `stopPlaceType=${type}`))
    }

    const topoiChips = state.userReducer.searchFilters.topoiChips

    topoiChips.forEach( (t) => {
      if (t.type === 'county') {
        queryParams.push(`countyReference=${t.ref}`)
      } else {
        queryParams.push(`municipalityReference=${t.ref}`)
      }
    })

    if (!queryParams.length) {
      return
    }

    const responseURL = URL + '?' + queryParams.join('&')

    var CancelToken = axios.CancelToken

    return axios.get(responseURL, {
      cancelToken: new CancelToken(function executor(cancel) {
        dispatch( sendData(types.REQUESTED_STOP_NAMES, cancel) )
      })
    })
    .then(function(response) {
      const suggestions = formatMarkers(response.data)

      dispatch( sendData(types.RECEIVED_STOP_NAMES, suggestions) )
    })
    .catch(function(response){
      if (axios.isCancel(response)) {
        //console.warn('Request canceled', response.message);
      } else {
        dispatch( sendData(types.ERROR_STOP_NAMES, response.data) )
      }
    })

  }

   thunk.meta = {
     debounce: {
       time: 300,
       key: 'search-for-stop'
     }
   }

   return thunk
}

AjaxActions.getStopsNearbyForOverview = (boundingBox) => {

 const thunk = function(dispatch, getState) {

   const URL =  window.config.tiamatBaseUrl + 'stop_place/search'
   const state = getState()

   let ignoreStopPlaceId = 0

   if (state.stopPlacesReducer.activeMarker) {
     ignoreStopPlaceId = state.stopPlacesReducer.activeMarker.markerProps.id
   }

   let payLoad = {
     boundingBox: boundingBox,
     ignoreStopPlaceId: ignoreStopPlaceId
   }

   return axios.post(URL, payLoad)
   .then(function(response) {
     let formattedMarkers = formatMarkers(response.data)
     formattedMarkers = removeQuaysForStops(formattedMarkers)
     dispatch (sendData(types.RECEIVED_STOPS_OVERVIEW_NEARBY, formattedMarkers))
   })
   .catch(function(response) {
     dispatch (sendData(types.ERROR_STOPS_OVERVIEW_NEARBY, response.data))
   })
 }

  thunk.meta = {
    debounce: {
      time: 500,
      key: 'get-stops-nearby-overall'
    }
  }

  return thunk

}

 AjaxActions.getStopsNearbyForEditingStop = (boundingBox, ignoreStopPlaceId) => {

  const thunk = function(dispatch) {

    const URL =  window.config.tiamatBaseUrl + 'stop_place/search'

    let payLoad = {
      boundingBox: boundingBox,
      ignoreStopPlaceId: ignoreStopPlaceId || 0
    }

    var CancelToken = axios.CancelToken

    return axios.post(URL, payLoad, {
      cancelToken: new CancelToken(function(cancel) {
        dispatch ( sendData(types.REQUESTED_STOPS_EDITING_NEARBY, cancel) )
      })
    })
    .then(function(response) {
      let formattedMarkers = formatMarkers(response.data)
      formattedMarkers = removeQuaysForStops(formattedMarkers)
      dispatch (sendData(types.RECEIVED_STOPS_EDITING_NEARBY, formattedMarkers))
    })
    .catch(function(response) {
      if (axios.isCancel(response)) {
        //console.warn('Request canceled', response.message);
      } else {
        dispatch (sendData(types.ERROR_STOPS_EDITING_NEARBY, response.data))
      }
    })
  }

   thunk.meta = {
     debounce: {
       time: 500,
       key: 'get-stops-nearby-editing'
     }
   }

   return thunk

}

const removeQuaysForStops = (markers) => {
  markers.map( (marker) => {
    marker.markerProps.quays = []
    return marker
  })

  return markers
}

export const formatMarkers = (data) => {

  try {

    return data.map ( (stop, index) => {

      stop.quays
          .sort( (q1,q2) => q1.id > q2.id)
          .map( (quay) => {
        quay.centroid.location = {
          latitude: setDecimalPrecision(quay.centroid.location.latitude, 6),
          longitude: setDecimalPrecision(quay.centroid.location.longitude, 6)
        }
      })

      let suggestion = {
        text: '<<>>',
        value: stop.id,
        markerProps: {
          key: `marker${index}`,
          name: stop.name || '',
          id: stop.id,
          position: [
            setDecimalPrecision(stop.centroid.location.latitude,6),
            setDecimalPrecision(stop.centroid.location.longitude,6)
          ],
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
        let stops = formatMarkers([response.data])
        stops[0].active = true
        dispatch( sendData(types.RECEIVED_STOP, stops[0]))
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

      let newStop = Object.assign({}, state.stopPlacesReducer.newStopPlace, {})
      delete newStop.isNewStop
      newStop.active = true

      dispatch( sendData(types.RECEIVED_STOP, newStop) )
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

    var stop = { ...getState().editStopReducer.activeStopPlace }

    const URL = window.config.tiamatBaseUrl + 'stop_place/' + stop.markerProps.id

    var savableStop = prepareStopForSaving(stop)

    return axios.post(URL, savableStop)
    .then(function(response) {
      let responseStop = formatMarkers([response.data])[0]
      responseStop.active = true
      dispatch( sendData(types.SUCCESS_STOP_SAVED, responseStop) )
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED))
      dispatch( sendData(types.RECEIVED_STOP, responseStop) )
    })
    .catch(function(response){
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED))
      dispatch( sendData(types.ERROR_STOP_SAVED, response.data) )
    })

  }
}

AjaxActions.saveNewStop = () => {

  return function(dispatch, getState) {

    var stop = { ...getState().stopPlacesReducer.newStopPlace }
    let savableStop = prepareStopForSaving(stop)

    const URL = window.config.tiamatBaseUrl + 'stop_place/'

    return axios.post(URL, savableStop)
    .then(function(response) {

      let formattedMarker = formatMarkers([response.data])
      let marker = formattedMarker[0]
      marker.active = true

      dispatch( sendData(types.SUCCESS_STOP_SAVED, marker) )
      dispatch( sendData(types.RECEIVED_STOP, marker) )
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED))
      dispatch ( UserActions.navigateTo('/edit/', response.data.id) )
    })
    .catch(function(response){
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED))
      dispatch( sendData(types.ERROR_STOP_SAVED, response) )
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
      console.error('Unable to populate topopgraphical places', response)
    })
  }
}

export default AjaxActions
