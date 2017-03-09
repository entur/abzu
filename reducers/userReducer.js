import * as types from '../actions/Types'

export const initialState = {
  path: '/',
  isCreatingNewStop: false,
  missingCoordsMap: {},
  searchFilters: {
    stopType: [],
    topoiChips: [
     // e.g. {key: 0, text: 'Nordland', type: 'county', value: 2},
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
  favoriteNameDialogIsOpen: false,
  removedFavorites: [],
  activeBaselayer: 'Rutebankens kart',
  activeElementTab: 0,
  showEditQuayAdditional: false,
  showEditStopAdditional: false
}

const userReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {
        path: action.payLoad,
        missingCoordsMap: {},
        showEditQuayAdditional: false,
        showEditStopAdditional: false
      })

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

    case types.CHANGED_ACTIVE_BASELAYER:
      return Object.assign({}, state, { activeBaselayer: action.payLoad})

    case types.SET_MISSING_COORDINATES:
      let newMissingCoordsMap = Object.assign({}, state.missingCoordsMap)
      newMissingCoordsMap[action.payLoad.stopPlaceId] = action.payLoad.position
      return Object.assign({}, state, { missingCoordsMap: newMissingCoordsMap })

    case types.CHANGED_ELEMENT_TYPE_TAB:
      return Object.assign({}, state, { activeElementTab: action.payLoad })

    case types.ADDED_JUNCTION_ELEMENT:
      const elementsMap = ['quay', 'pathJunction', 'entrance']
      return Object.assign({}, state, { activeElementTab: elementsMap.indexOf(action.payLoad.type)})

    case types.SHOW_EDIT_QUAY_ADDITIONAL:
      return Object.assign({}, state, {
        showEditQuayAdditional: true
      })

    case types.HID_EDIT_QUAY_ADDITIONAL:
      return Object.assign({}, state, {
        showEditQuayAdditional: false
      })

    case types.SHOW_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        showEditStopAdditional: true
      })

    case types.SET_FOCUS_ON_ELEMENT:
      if (action.payLoad.index > -1) {
        return Object.assign({}, state, {
          showEditStopAdditional: false
        })
      }

      return state

    case types.HID_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        showEditStopAdditional: false
      })

      break;

    default:
      return state
  }
}

export default userReducer
