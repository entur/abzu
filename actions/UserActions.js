import * as types from './actionTypes'
import { Link, browserHistory } from 'react-router'

var UserActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}


UserActions.navigateTo = (path, id) => {
  return function(dispatch) {
    dispatch( sendData(types.NAVIGATE_TO, id) )
    const basePath = '/admin/abzu'
    browserHistory.push(basePath+path+id)
  }
}


export default UserActions
