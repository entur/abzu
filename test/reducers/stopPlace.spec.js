import * as types from './../../actions/actionTypes'
import expect from 'expect'
import { graphQLReducer } from './../../reducers/'
import stopPlaceData from './json/graphql_stopPlace.json'

describe('stop place reducer', () => {

  it('should create new stop with coordinates', () => {

    const location = [40,10]

    const action = {
      type: types.CREATED_NEW_STOP,
      payLoad: location
    }

    const state = graphQLReducer({}, action)
    expect(state.newStop.location).toEqual(location)
  })


  it('update stop name should not mutate state', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: 'stopPlace'
    }
    const stateBefore = graphQLReducer({}, action)

    const changeNameAction = {
      type: types.CHANGED_STOP_NAME,
      payLoad: 'new stop name'
    }
    const stateAfter = graphQLReducer(stateBefore, changeNameAction)

    expect(stateAfter).toNotEqual(stateBefore)
    expect(stateAfter.current).toNotEqual(stateBefore.current)
    expect(stateAfter.current.name).toEqual('new stop name')
  })

  it('update to stop description should not mutate state', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: 'stopPlace'
    }
    const stateBefore = graphQLReducer({}, action)

    const changeNameAction = {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: 'new description'
    }
    const stateAfter = graphQLReducer(stateBefore, changeNameAction)

    expect(stateAfter).toNotEqual(stateBefore)
    expect(stateAfter.current).toNotEqual(stateBefore.current)
    expect(stateAfter.current.description).toEqual('new description')
  })

  it('update to stop location should not mutate state', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: 'stopPlace'
    }

    const newDehli = [28.644800, 77.216721]

    const stateBefore = graphQLReducer({}, action)

    const changeNameAction = {
      type: types.CHANGED_ACTIVE_STOP_POSITION,
      payLoad: { location: newDehli }
    }
    const stateAfter = graphQLReducer(stateBefore, changeNameAction)

    expect(stateAfter).toNotEqual(stateBefore)
    expect(stateAfter.current).toNotEqual(stateBefore.current)
    expect(stateAfter.current.location).toEqual(newDehli)
  })

})

