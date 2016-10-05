import * as types from './../actions/actionTypes'

const initialState = {
  path: '/',
  isCreatingNewStop: false,
  searchFilters: {
    stopType: []
  },
  snackbarOptions: {
    isOpen: false,
    message: ''
  },
  localization: {
    locale: null,
    messages: []
  },
  appliedLocale: null
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    case types.TOGGLED_IS_CREATING_NEW_STOP:
      return Object.assign({}, state, { isCreatingNewStop: !state.isCreatingNewStop })

    case types.APPLIED_STOPTYPE_SEARCH_FILTER:
      return Object.assign({}, state, { searchFilters: { stopType: action.payLoad}})

    case types.OPENED_SNACKBAR:
      return Object.assign({}, state, {snackbarOptions: { isOpen: true, message: action.payLoad}})

    case types.DISMISSED_SNACKBAR:
      return Object.assign({}, state, {snackbarOptions: { isOpen: false }})

    case types.CHANGED_LOCALIZATION:
      return Object.assign({}, state, {localization: action.payLoad})

    case types.APPLIED_LOCALE:
      return Object.assign({}, state, { appliedLocale: action.payLoad })

    default:
      return state
  }
}

export default userReducer
