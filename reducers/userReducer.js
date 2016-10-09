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
  appliedLocale: null,
  topoi: [], // source for TopographicalFilter autocomplete
  topoiChips: [
   {key: 0, label: 'Nordland', type: 'county'},
   {key: 1, label: 'Oslo', type: 'municipality'},
   {key: 3, label: 'Fredrikstad', type: 'county'},
  ]
}

const getMockedTopi = () => {
  const asker = {
    ref: '1',
    name: 'Asker',
    county: 'Akershus',
    type: 'municipality'
  }

  const akerhus = {
    ref: '2',
    type: 'county',
    name: 'Akershus'
  }

  return [asker, akerhus]
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

    case types.GET_TOPOGRAPHICAL_PLACES:
      // TODO : Should filter out chips already present
      return Object.assign({}, state, { topoi: getMockedTopi()})

    case types.ADDED_TOPOS_CHIP:
      let newChipList = state.topoiChips.splice(0)
      let newChipToAdd = action.payLoad
      newChipToAdd.key = newChipList.push(newChipToAdd)
      return Object.assign({}, state, { topoiChips: newChipList })

    case types.DELETED_TOPOS_CHIP:
      let chipToDelete = state.topoiChips.map((chip) => chip.key).indexOf(action.payLoad)
      let chips = state.topoiChips.slice(0)
      chips.splice(chipToDelete, 1)
      return Object.assign({}, state, { topoiChips: chips })

      break;

    default:
      return state
  }
}

export default userReducer
