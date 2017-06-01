import * as types from '../actions/Types'

export const initialState = {
  focusedElement: {
    type: 'quay',
    index: -1
  },
  mergingQuay: {
    isMerging: false,
    fromQuay: null,
    toQuay: null
  },
  mergingQuayDialogOpen: false
}

const mapReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {
        focusedElement: {
          type: 'quay',
          index: -1
        }
      })

    case types.SET_ACTIVE_MAP:
      return Object.assign({}, state, { activeMap: action.payLoad})

    case types.SET_FOCUS_ON_ELEMENT:
      return Object.assign({}, state, {
        focusedElement: {
          index: action.payLoad.index,
          type: action.payLoad.type
        }
      })

    case types.SHOW_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        focusedElement: {
          index: -1,
          type: 'quay'
        }
      })

    case types.STARTED_MERGING_QUAY_FROM:
      return Object.assign({}, state, { mergingQuay: {
        isMerging: true,
        fromQuayId: action.payLoad,
        toQuay: null
      }})

    case types.ENDED_MERGING_QUAY_TO:
      return Object.assign({}, state, {
        mergingQuayDialogOpen: true,
        mergingQuay: {
          isMerging: false,
          fromQuayId: state.mergingQuay.fromQuayId,
          toQuayId: action.payLoad
      }})

    case types.CANCELLED_MERGING_QUAY_FROM:
      return Object.assign({}, state, { mergingQuay: {
        isMerging: false,
        fromQuay: null,
        toQuay: null
      }})

    case types.CLOSED_MERGE_QUAYS_DIALOG:
      return Object.assign({}, state, {
        mergingQuayDialogOpen: false
      })

    default:
      return state
  }
}

export default mapReducer
