import * as types from '../actions/Types'

export const initialState = {
  focusedElement: {
    type: 'quay',
    index: -1
  }
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

    default:
      return state
  }
}

export default mapReducer
