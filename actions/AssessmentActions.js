import * as types from './Types'
import * as limitations from '../models/Limitations'

var AssessmentActions = {}

const sendData = (type, payLoad) => ({
  type: type,
  payLoad: payLoad
})

AssessmentActions.setStopWheelchairAccess = value => dispatch =>{
  dispatch(sendData(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
    value: value,
    limitationType: limitations.wheelchairAccess
  }))
}

AssessmentActions.setStopStepFreeAccess = value => dispatch => {
  dispatch(sendData(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
    value: value,
    limitationType: limitations.stepFreeAccess
  }))
}

AssessmentActions.setQuayWheelchairAccess = (value, index) => dispatch => {
  dispatch(sendData(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
    value: value,
    index: index,
    limitationType: limitations.wheelchairAccess
  }))
}

AssessmentActions.setQuayStepFreeAccess = (value, index) => dispatch => {
  dispatch(sendData(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
    value: value,
    index: index,
    limitationType: limitations.stepFreeAccess
  }))
}

export default AssessmentActions