import * as types from './../actions/actionTypes'

const intialState = {
  path: ''
}

const userReducer = (state = intialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    default:
      return state
  }
}

export default userReducer
