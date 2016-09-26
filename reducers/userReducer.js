import * as types from './../actions/actionTypes'

const initialState = {
  path: '/'
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    default:
      return state
  }
}

export default userReducer
