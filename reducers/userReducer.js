import * as types from './../actions/actionTypes'

const initialState = {
  path: '/',
  isCreatingNewStop: false,
  searchFilters: {
    stopType: []
  }
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    case types.TOGGLED_IS_CREATING_NEW_STOP:
      return Object.assign({}, state, { isCreatingNewStop: !state.isCreatingNewStop })

    case types.APPLIED_STOPTYPE_SEARCH_FILTER:
      return Object.assign({}, state, { searchFilters: { stopType: action.payLoad}})

    default:
      return state
  }
}

export default userReducer
