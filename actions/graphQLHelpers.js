import formatHelpers from './formatHelpers'

const helpers = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

helpers.connectStop = dispatch => ({ stopPlace }) => {
  if (stopPlace && stopPlace[0]) {
    return dispatch(sendData('TEST_GRAPHQL', formatHelpers.mapStopToClientStop(stopPlace[0])))
  }
}


export default helpers