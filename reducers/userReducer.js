/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import * as types from '../actions/Types';

export const initialState = {
  path: '/',
  missingCoordsMap: {},
  searchFilters: {
    stopType: [],
    topoiChips: [
      // e.g. {key: 0, text: 'Nordland', type: 'county', value: 2},
    ],
    text: ''
  },
  localization: {
    locale: null,
    messages: []
  },
  appliedLocale: null,
  favoriteNameDialogIsOpen: false,
  removedFavorites: [],
  activeElementTab: 0,
  showEditQuayAdditional: false,
  showEditStopAdditional: false,
  keyValuesDialogOpen: false,
  keyValuesDialogSource: [],
  keyValuesOrigin: null,
  lookupCoordinatesOpen: false,
  newStopIsMultiModal: false,
  isCreatingNewStop: false,
  serverTimeDiff: 0,
  deleteStopDialogWarning: {
    warning: false,
    stopPlaceId: null
  }
};

const userReducer = (state = initialState, action) => {

  switch (action.type) {
    case types.NAVIGATE_TO:
      return Object.assign({}, state, {
        path: action.payLoad,
        showEditQuayAdditional: false,
        showEditStopAdditional: false,
        isCreatingNewStop: false,
        keyValuesDialogOpen: false,
        deleteStopDialogWarning: {
          warning: false,
          stopPlaceId: null
        }
      });

    case types.TOGGLED_IS_CREATING_NEW_STOP:
      return Object.assign({}, state, {
        isCreatingNewStop: !state.isCreatingNewStop,
        newStopIsMultiModal: action.payLoad,
      });

    case types.APPLIED_STOPTYPE_SEARCH_FILTER:
      return Object.assign({}, state, {
        searchFilters: { ...state.searchFilters, stopType: action.payLoad }
      });

    case types.REMOVED_ALL_FILTERS:
      return Object.assign({}, state, {
        searchFilters: { topoiChips: [], stopType: [] }
      });

    case types.OPEN_LOOKUP_COORDINATES_DIALOG:
      return Object.assign({}, state, {
        lookupCoordinatesOpen: true
      });

    case types.CLOSED_LOOKUP_COORDINATES_DIALOG:
      return Object.assign({}, state, {
        lookupCoordinatesOpen: false
      });

    case types.CHANGED_LOCALIZATION:
      return Object.assign({}, state, { localization: action.payLoad });

    case types.APPLIED_LOCALE:
      return Object.assign({}, state, { appliedLocale: action.payLoad });

    case types.ADDED_TOPOS_CHIP:
      let newChipList = state.searchFilters.topoiChips.splice(0);
      let newChipToAdd = action.payLoad;
      newChipToAdd.key = newChipList.push(newChipToAdd);
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          topoiChips: newChipList
        }
      });

    case types.DELETED_TOPOS_CHIP:
      let chips = state.searchFilters.topoiChips
        .filter(chip => chip.value !== action.payLoad);
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          topoiChips: chips
        }
      });

    case types.SHOW_CREATED_NEW_STOP_INFO:
      return Object.assign({}, state, {
        newStopCreated: {
          open: true,
          stopPlaceId: action.payLoad
        }
      });

    case types.HIDE_CREATED_NEW_STOP_INFO:
      return Object.assign({}, state, {
        newStopCreated: {
          open: false,
          stopPlaceId: null
        }
      });

    case types.SET_TOPOS_CHIPS:
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          topoiChips: action.payLoad
        }
      });

    case types.SET_STOP_PLACE_TYPES:
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          stopType: action.payLoad
        }
      });

    case types.TOGGLE_SHOW_FUTURE_AND_EXPIRED:
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          showFutureAndExpired: action.payLoad
        }
      });

      case types.TOGGLE_SEARCH_WITH_CODE:
      return Object.assign({}, state, {
          searchFilters: {
            ...state.searchFilters,
            searchWithCode: action.payLoad
          }
      });

    case types.SET_SEARCH_TEXT:
      return Object.assign({}, state, {
        searchFilters: {
          ...state.searchFilters,
          text: action.payLoad
        }
      });

    case types.OPENED_FAVORITE_NAME_DIALOG:
      return Object.assign({}, state, { favoriteNameDialogIsOpen: true });

    case types.CLOSED_FAVORITE_NAME_DIALOG:
      return Object.assign({}, state, { favoriteNameDialogIsOpen: false });

    case types.REMOVE_SEARCH_AS_FAVORITE:
      return Object.assign({}, state, {
        removedFavorites: state.removedFavorites.concat(action.payLoad)
      });

    case types.CHANGED_ACTIVE_BASELAYER:
      return Object.assign({}, state, { activeBaselayer: action.payLoad });

    case types.SET_MISSING_COORDINATES:
      let newMissingCoordsMap = Object.assign({}, state.missingCoordsMap);
      newMissingCoordsMap[action.payLoad.stopPlaceId] = action.payLoad.position;
      return Object.assign({}, state, {
        missingCoordsMap: newMissingCoordsMap
      });

    case types.CHANGED_ELEMENT_TYPE_TAB:
      return Object.assign({}, state, { activeElementTab: action.payLoad });

    case types.ADDED_JUNCTION_ELEMENT:
      let activeElementTabIndex = -1;

      if (action.payLoad.type === 'quay') {
        activeElementTabIndex = 0;
      } else if (
        action.payLoad.type === 'pathJunction' ||
        action.payLoad.type === 'entrance'
      ) {
        activeElementTabIndex = 1;
      } else if (
        action.payLoad.type === 'parkAndRide' ||
        action.payLoad.type === 'bikeParking'
      ) {
        activeElementTabIndex = 2;
      } else {
        console.warn('type is not supported', action.payLoad.type);
        activeElementTabIndex = -1;
      }

      return Object.assign({}, state, {
        activeElementTab: activeElementTabIndex
      });

    case types.SHOW_EDIT_QUAY_ADDITIONAL:
      return Object.assign({}, state, {
        showEditQuayAdditional: true
      });

    case types.HID_EDIT_QUAY_ADDITIONAL:
      return Object.assign({}, state, {
        showEditQuayAdditional: false
      });

    case types.SHOW_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        showEditStopAdditional: true
      });

    case types.SET_FOCUS_ON_ELEMENT:
      if (action.payLoad.index > -1) {
        return Object.assign({}, state, {
          showEditStopAdditional: false
        });
      }

      return state;

    case types.HID_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        showEditStopAdditional: false
      });

    case types.OPENED_KEY_VALUES_DIALOG:
      return Object.assign({}, state, {
        keyValuesDialogOpen: true,
        keyValuesOrigin: {
          type: action.payLoad.type,
          index: action.payLoad.index
        }
      });

    case types.CLOSED_KEY_VALUES_DIALOG:
      return Object.assign({}, state, {
        keyValuesDialogOpen: false,
      });

    case types.SET_SERVER_DIFF_TIME:
      return Object.assign({}, state, {
        serverTimeDiff: action.payLoad,
      });

    case types.SORTED_QUAYS:
      return Object.assign({}, state, {
        keyValuesDialogOpen: false,
        showEditStopAdditional: false,
        showEditQuayAdditional: false,
      });

    case types.TOGGLE_SHOW_PUBLIC_CODE:
      return Object.assign({}, state, {
        showPublicCode: action.payLoad
      });

    case types.TERMINATE_DELETE_STOP_DIALOG_WARNING:
      return Object.assign({}, state, {
        deleteStopDialogWarning: action.payLoad
      });

    default:
      return state;
  }
};

export default userReducer;
