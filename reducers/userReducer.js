import * as types from './../actions/actionTypes'

const initialState = {
  path: '/',
  isCreatingNewStop: false,
  searchFilters: {
    stopType: [],
    topoiChips: [
     // e.g. {key: 0, label: 'Nordland', type: 'county', ref: 2},
   ],
   text: ''
  },
  snackbarOptions: {
    isOpen: false,
    message: ''
  },
  localization: {
    locale: null,
    messages: []
  },
  appliedLocale: null,
  // received data from GET:/topographic_place
  topoiSource: [],
  // source for TopographicalFilter autocomplete
  topoiSuggestions: [],
  favoriteNameDialogIsOpen: false,
  removedFavorites: []
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {path: action.payLoad})

    case types.TOGGLED_IS_CREATING_NEW_STOP:
      return Object.assign({}, state, { isCreatingNewStop: !state.isCreatingNewStop })

    case types.APPLIED_STOPTYPE_SEARCH_FILTER:
      return Object.assign({}, state, { searchFilters: { ...state.searchFilters, stopType: action.payLoad}})

    case types.OPENED_SNACKBAR:
      return Object.assign({}, state, {snackbarOptions: { isOpen: true, message: action.payLoad}})

    case types.DISMISSED_SNACKBAR:
      return Object.assign({}, state, {snackbarOptions: { isOpen: false }})

    case types.CHANGED_LOCALIZATION:
      return Object.assign({}, state, {localization: action.payLoad})

    case types.APPLIED_LOCALE:
      return Object.assign({}, state, { appliedLocale: action.payLoad })

    case types.RECEIVED_TOPOGRAPHICAL_PLACES:
      return Object.assign({}, state, { topoiSource: action.payLoad })

    case types.GET_TOPOGRAPHICAL_PLACES:
      return Object.assign({}, state, { topoiSuggestions: action.payLoad })

    case types.ADDED_TOPOS_CHIP:
      let newChipList = state.searchFilters.topoiChips.splice(0)
      let newChipToAdd = action.payLoad
      newChipToAdd.key = newChipList.push(newChipToAdd)
      return Object.assign({}, state, { searchFilters: {
        ...state.searchFilters, topoiChips: newChipList
      }})

    case types.DELETED_TOPOS_CHIP:
      let chipToDelete = state.searchFilters.topoiChips.map((chip) => chip.key).indexOf(action.payLoad)
      let chips = state.searchFilters.topoiChips.slice(0)
      chips.splice(chipToDelete, 1)
      return Object.assign({}, state, { searchFilters: {
        ...state.searchFilters, topoiChips: chips
      }})

    case types.SET_TOPOS_CHIPS:
      return Object.assign({}, state, { searchFilters:  {
          ...state.searchFilters, topoiChips: action.payLoad
      }})

    case types.SET_STOP_PLACE_TYPES:
      return Object.assign({}, state, { searchFilters: {
        ...state.searchFilters, stopType: action.payLoad
      }})

    case types.SET_SEARCH_TEXT:
      return Object.assign({}, state, { searchFilters: {
        ...state.searchFilters, text: action.payLoad
      }})

    case types.OPENED_FAVORITE_NAME_DIALOG:
      return Object.assign({}, state, {favoriteNameDialogIsOpen: true})

    case types.CLOSED_FAVORITE_NAME_DIALOG:
      return Object.assign({}, state, {favoriteNameDialogIsOpen: false})

    case types.REMOVE_SEARCH_AS_FAVORITE:
      return Object.assign({}, state, {
        removedFavorites: state.removedFavorites.concat(action.payLoad)
      })

      break;

    default:
      return state
  }
}

export default userReducer
