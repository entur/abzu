import * as types from './../actions/actionTypes'

const initialState = {
  path: '/',
  isCreatingNewStop: false
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    case types.TOGGLED_IS_CREATING_NEW_STOP:
      return Object.assign({}, state, { isCreatingNewStop: !state.isCreatingNewStop })

    default:
      return state
  }
}

export default userReducer
