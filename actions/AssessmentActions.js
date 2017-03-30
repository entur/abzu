import * as types from './Types'
import * as limitations from './Limitations'

var AssessmentActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

AssessmentActions.setStopWheelchairAccess = value => {
  return function(dispatch) {
    dispatch(sendData(types.CHANGED_STOP_WHEELCHAIR_ACCESS, {
      value: value,
      limitationType: limitations.wheelchairAccess
    }))
  }
}

AssessmentActions.setQuayWheelchairAccess = (value, index) => {
  return function(dispatch) {
    dispatch(sendData(types.CHANGED_QUAY_WHEELCHAIR_ACCESS, {
      value: value,
      index: index,
      limitationType: limitations.wheelchairAccess
    }))
  }
}

export default AssessmentActions