import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'
import { editStopReducer } from './../../reducers/'
import { initialState } from './../../reducers/editStopReducer'

const stopPlace = JSON.parse(fs.readFileSync(__dirname + '/json/exampleStop.json', 'utf-8'))

describe('edit stop reducer', () => {

  let stopPlaces = JSON.parse(fs.readFileSync(__dirname + '/json/activeStopPlaces.json', 'utf-8'))

  it('Should return the initial state', () => {
    expect(editStopReducer(undefined, {}))
      .toEqual(initialState)
  })

  it('Should change map upon CHANGED_MAP_CENTER', () => {
    const centerPosition = [
      67.928595,
      13.083002
    ]
    expect(editStopReducer(initialState, { centerPosition: centerPosition} ))
      .toEqual({ ...initialState,centerPosition: centerPosition })
  })

  it('Should set isLoading when requesting stop', () => {

    expect(editStopReducer(initialState, {
      type: types.REQUESTED_STOP
    }))
      .toEqual({ ...initialState,
        activeStopIsLoading: true
      })
  })

  it('Should stop loading when loading stop failed', () => {
    expect(editStopReducer(initialState, {
      type: types.ERROR_STOP
    }))
      .toEqual({ ...initialState,
        activeStopIsLoading: false
      })
  })

  it('Should add new quay to stop place', () => {

    let payLoad = {...stopPlace}
    let stateWithOneStopPlaceTwoQuays = { ...initialState, activeStopPlace: payLoad}

    let newState = editStopReducer(stateWithOneStopPlaceTwoQuays, {
      type: types.ADDED_NEW_QUAY
    })

    expect(newState.activeStopPlace.markerProps.quays.length).toEqual(3)
  })

  it('Should remove quay from stop place by correct index', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')
    expect(state.activeStopPlace.markerProps.quays.length).toEqual(3)

    let newState = editStopReducer(state, {
      type: types.REMOVED_QUAY,
      payLoad: 1
    })

    let quay1Name = 'Brusvehagen1'

    expect(newState.activeStopPlace.markerProps.quays.length).toEqual(2)
    expect(newState.activeStopPlace.markerProps.quays[0].name).toEqual(quay1Name)

  })

  it('Should change quay name by index', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')
    let newQuayName = 'testQuayName'
    let quayIndex = 0

    let newState = editStopReducer(state, {
      type: types.CHANGED_QUAY_NAME,
      payLoad: {
        name: newQuayName,
        index: quayIndex
      }
    })

    expect(newState.activeStopPlace.markerProps.quays[quayIndex].name).toEqual(newQuayName)

  })

  it('Should change quay description by index', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')
    let newQuayDescription = 'testQuayDescription'
    let quayIndex = 0

    let newState = editStopReducer(state, {
      type: types.CHANGED_QUAY_DESCRIPTION,
      payLoad: {
        description: newQuayDescription,
        index: quayIndex
      }
    })

    expect(newState.activeStopPlace.markerProps.quays[quayIndex].description).toEqual(newQuayDescription)

  })

  it('Should change quay allAreasWheelchairAccessible', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')
    let allAreasWheelchairAccessible = true
    let quayIndex = 0

    let newState = editStopReducer(state, {
      type: types.CHANGED_WHA,
      payLoad: {
        value: allAreasWheelchairAccessible,
        index: quayIndex
      }
    })

    expect(newState.activeStopPlace.markerProps.quays[quayIndex].allAreasWheelchairAccessible)
      .toEqual(allAreasWheelchairAccessible)

  })

  it('Should change quay position', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let position = {
      lat: 60.79822889424686,
      lng: 10.685556718522529
    }

    let quayIndex = 0

    let newState = editStopReducer(state, {
      type: types.CHANGED_QUAY_POSITION,
      payLoad: {
        position: position,
        quayIndex: quayIndex
      }
    })

    expect(newState.activeStopPlace.markerProps.quays[quayIndex].centroid.location)
      .toEqual({
        latitude: position.lat,
        longitude: position.lng
      })

  })

  it('Should change position of active stop', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let position = {
      lat: 60.79822889424686,
      lng: 10.685556718522529
    }

    let newState = editStopReducer(state, {
      type: types.CHANGED_ACTIVE_STOP_POSITION,
      payLoad: {
        position: position
      }
    })

    expect(newState.activeStopPlace.markerProps.position)
      .toEqual([position.lat, position.lng])

  })

  it('Should receive stops nearby for editing stop', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let neighbouringStops = stopPlaces.splice(0)

    let newState = editStopReducer(state, {
      type: types.RECEIVED_STOPS_EDITING_NEARBY,
      payLoad: neighbouringStops
    })

    expect(newState.neighbouringMarkers).toEqual(neighbouringStops)

  })

  it('Should change stop name', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let stopName = 'Narnia'

    let newState = editStopReducer(state, {
      type: types.CHANGED_STOP_NAME,
      payLoad: stopName
    })

    expect(newState.activeStopPlace.markerProps.name).toEqual(stopName)

  })

  it('Should change stop description', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let stopDescription = 'A secret place'

    let newState = editStopReducer(state, {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: stopDescription
    })

    expect(newState.activeStopPlace.markerProps.description).toEqual(stopDescription)

  })

  it('Should change stop type', () => {

    let state = editStopReducer({...initialState, activeStopPlace: stopPlace}, 'undefined')

    let stopType = 'railStation'

    let newState = editStopReducer(state, {
      type: types.CHANGED_STOP_TYPE,
      payLoad: stopType
    })

    expect(newState.activeStopPlace.markerProps.stopPlaceType).toEqual(stopType)

  })

  it('Should restore to original stop place', () => {

    let newState = editStopReducer(initialState, {
      type: types.RECEIVED_STOP,
      payLoad: stopPlace
    })

    let originalStopPlace = newState.activeStopPlaceOriginal

    let stopType = 'metroStop'

    newState = editStopReducer(newState, {
      type: types.CHANGED_STOP_TYPE,
      payLoad: stopType
    })

    let stopDescription = 'A great place'

    newState = editStopReducer(newState, {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: stopDescription
    })

    let stopName = 'A stop name'

     newState = editStopReducer(newState, {
      type: types.CHANGED_STOP_NAME,
      payLoad: stopName
    })

    let finalState = editStopReducer(newState, {
      type: types.RESTORED_TO_ORIGINAL_STOP_PLACE
    })

    expect(finalState.activeStopPlace).toEqual(originalStopPlace)

  })

  it('Should create a new path link from a quay', () => {

    let coordinates = ["59.505176", "10.505176"]
    const quayIndex = 0

    let newState = editStopReducer(initialState, {
      type: types.STARTED_CREATING_POLYLINE,
      payLoad: {
        coordinates: coordinates,
        index: quayIndex,
        type: 'quay'
      }
    })

    let polyline = {
      startPoint: {
        coordinates: coordinates.map( (c) => Number(c)),
        index: quayIndex,
        type: 'quay'
      },
      inlinePositions: []
    }
    expect(newState.multiPolylineDataSource).toEqual([polyline])

  })

  it('Should add inline positions to path link', () => {

    let coordinates = [59.505176, 10.505176]
    const quayIndex = 0

    let newState = editStopReducer(initialState, {
      type: types.STARTED_CREATING_POLYLINE,
      payLoad: {
        coordinates: coordinates,
        index: quayIndex,
        type: 'quay'
      }
    })

    let polyline = {
      startPoint: {
        coordinates: coordinates,
        index: quayIndex,
        type: 'quay'
      },
      inlinePositions: []
    }

    let exampleCoordinates = [59.0, 10.0]

    let finalState = editStopReducer(newState, {
      type: types.ADDED_COORDINATES_TO_POLYLINE,
      payLoad: exampleCoordinates
    })

    polyline.inlinePositions = [exampleCoordinates]

    expect(finalState.multiPolylineDataSource).toEqual([polyline])

  })

  it('Should add end quay to path link', () => {

    let coordinates = ["59.505176", "10.505176"]
    const quayIndex = 0

    let newState = editStopReducer(initialState, {
      type: types.STARTED_CREATING_POLYLINE,
      payLoad: {
        coordinates: coordinates,
        index: quayIndex,
        type: 'quay'
      }
    })

    let polyline = {
      startPoint: {
        coordinates: coordinates.map( (c) => Number(c)),
        index: quayIndex,
        type: 'quay'
      },
      inlinePositions: []
    }

    let coordinates2 = [58.2, 11.1]
    const quayIndex2 = 1

    let finalState = editStopReducer(newState, {
      type: types.ADDED_FINAL_COORDINATES_TO_POLYLINE,
      payLoad: {
        coordinates: coordinates2,
        index: quayIndex2,
        type: 'quay'
      }
    })

    polyline.endPoint = {
      coordinates: coordinates2,
      index: quayIndex2,
      type:  'quay'
    }

    expect(finalState.multiPolylineDataSource).toEqual([polyline])
  })
})
