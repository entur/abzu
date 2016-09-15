import suggestions from '../config/restMock.js'
import * as types from './actionTypes'

var AjaxCreator = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

AjaxCreator.getDataSource = () => {

  const dataSource = suggestions.map( (stop, index) => {
      return {
        text: `${stop.name}, ${stop.municipality} (${stop.county})`,
        value: stop.id,
        location: {
          lng: stop.centroid.location.longitude,
          lat: stop.centroid.location.latitude
        },
        markerProps: {
          key: `marker${index}`,
          position: [stop.centroid.location.latitude, stop.centroid.location.longitude],
          children: stop.name,
          description: stop.description,
          municipality: stop.municipality,
          county: stop.county,
          quays: stop.quays,
          draggable: false
        }
      }
  })

  return function(dispatch) {
    dispatch( sendData(types.RECEIVED_DATASOURCE, dataSource))
  }

}

export default AjaxCreator
