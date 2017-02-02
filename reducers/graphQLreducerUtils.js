import formatHelpers from '../actions/formatHelpers'

export const getStateByOperation = (state, action) => {

  switch (action.operationName) {
    case 'stopPlace':
      return Object.assign({}, state, {
        current: formatHelpers.mapStopToClientStop(action.result.data.stopPlace[0], true)
      })
  }

}