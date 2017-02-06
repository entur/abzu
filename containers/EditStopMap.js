import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import LeafletMap from '../components/LeafletMap'
import { MapActions, UserActions } from '../actions/'
import { injectIntl } from 'react-intl'
import { setDecimalPrecision } from '../utils'
import CoordinatesDialog from '../components/CoordinatesDialog'
import CompassBearingDialog from '../components/CompassBearingDialog'
import { stopPlaceBBQuery } from "../actions/queries"
import { graphql } from 'react-apollo'
import debounce from 'lodash.debounce'

class EditStopMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinatesDialogOpen: false,
      compassBearingDialogOpen: false
    }
    const mapEnd = (event, { leafletElement }) => {

      let { ignoreStopId } = this.props

      if (ignoreStopId) {

        const bounds = leafletElement.getBounds()

        this.props.data.refetch({
          ignoreStopPlaceId: ignoreStopId,
          latMin: bounds.getSouthWest().lat,
          latMax: bounds.getNorthEast().lat,
          lonMin: bounds.getSouthWest().lng,
          lonMax: bounds.getNorthEast().lng
        })
      }
    }

    this.handleMapMoveEnd = debounce(mapEnd, 1000)
  }

  handleClick(event, map) {
    const { isCreatingPolylines, dispatch } = this.props

    if (isCreatingPolylines) {
      const coords = [event.latlng.lat, event.latlng.lng]
      dispatch(UserActions.addCoordinatesToPolylines(coords))
    }
  }

  handleCoordinatesDialogClose() {
    this.setState({
      coordinatesDialogOpen: false
    })
  }

  handleCompassBearingDialogClose() {
    this.setState({
      compassBearingDialogOpen: false
    })
  }

  handleDragEnd(isQuay, index, event) {
    const { dispatch } = this.props
    const position = event.target.getLatLng()

    let formattedPosition = {
      lat: setDecimalPrecision(position.lat,6),
      lng: setDecimalPrecision(position.lng,6)
    }

    if (isQuay) {
      dispatch(MapActions.changeQuayPosition(index, formattedPosition))
    } else {
      dispatch(MapActions.changeCurrentStopPosition(formattedPosition))
    }
  }

  handleSetCompassBearing(compassBearing, index) {
    this.setState({
      compassBearingDialogOpen: true,
      compassBearing: compassBearing,
      compassBearingOwner: index
    })
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value))
  }

  handleChangeCoordinates(isQuay, markerIndex, position) {
    this.setState({
      coordinatesDialogOpen: true,
      coordinates: position.join(','),
      coordinatesOwner: {
        isQuay: isQuay,
        markerIndex: markerIndex
      }
    })
  }

  handleSubmitChangeCoordinates(position) {
    const { coordinatesOwner } = this.state
    const { dispatch } = this.props

    if (coordinatesOwner.isQuay) {
      dispatch(MapActions.changeQuayPosition(coordinatesOwner.markerIndex, position))
    } else {
      dispatch(MapActions.changeCurrentStopPosition(position))
    }

    dispatch(MapActions.changeMapCenter(position, 14))

    this.setState(({
      coordinatesDialogOpen: false
    }))
  }

  handleSubmitChangeCompassBearing(compassBearing) {
    const { compassBearingOwner } = this.state
    this.props.dispatch(MapActions.changeQuayCompassBearing(compassBearingOwner, compassBearing))
    this.setState(({
      compassBearingDialogOpen: false
    }))
  }

  render() {

    const { position, markers, zoom, missingCoordsMap } = this.props
    const { coordinatesDialogOpen, compassBearingDialogOpen } =  this.state

    let minZoom = 5

    // Restricts zoom level if coordinates are provided either by the user or from backend
    /*if (stopPlace && stopPlace.markerProps && !stopPlace.markerProps.position) {
      if (!missingCoordsMap[stopPlace.markerProps.id]) {
        minZoom = 15
      }
    } */

    return (
      <div>
        <LeafletMap
          position={position}
          markers={markers}
          zoom={zoom}
          ref="leafletMap"
          key="leafletmap-edit"
          handleOnClick={this.handleClick.bind(this)}
          handleDragEnd={this.handleDragEnd.bind(this)}
          handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
          handleChangeCoordinates={this.handleChangeCoordinates.bind(this)}
          dragableMarkers={true}
          activeBaselayer={this.props.activeBaselayer}
          handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
          enablePolylines={this.props.enablePolylines}
          minZoom={minZoom}
          handleSetCompassBearing={this.handleSetCompassBearing.bind(this)}
        />
        <CoordinatesDialog
          intl={this.props.intl}
          open={coordinatesDialogOpen}
          coordinates={this.state.coordinates}
          handleClose={this.handleCoordinatesDialogClose.bind(this)}
          handleConfirm={this.handleSubmitChangeCoordinates.bind(this)}
        />
        <CompassBearingDialog
          open={compassBearingDialogOpen}
          intl={this.props.intl}
          compassBearing={this.state.compassBearing}
          handleClose={this.handleCompassBearingDialogClose.bind(this)}
          handleConfirm={this.handleSubmitChangeCompassBearing.bind(this)}
        />
      </div>
    )
  }

  componentDidMount() {
    const { leafletElement } = this.refs.leafletMap.refs.map
    this.props.dispatch(MapActions.setActiveMap(leafletElement))
  }
}

const mapStateToProps = state => {

  const currentStopPlace = state.stopPlace.current
  const neighbourStops = state.stopPlace.neighbourStops

  let markers = []

  if (currentStopPlace) {
    markers = markers.concat(currentStopPlace)
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(neighbourStops)
  }

  return {
    position: state.stopPlace.centerPosition,
    zoom: state.stopPlace.zoom,
    lastUpdated: state.editingStop.lastUpdated,
    activeBaselayer: state.user.activeBaselayer,
    enablePolylines: state.editingStop.enablePolylines,
    isCreatingPolylines: state.editingStop.isCreatingPolylines,
    missingCoordsMap: state.user.missingCoordsMap,
    markers: markers,
    ignoreStopId: state.stopPlace.current ? state.stopPlace.current.id : -1
  }
}

const getIdFromPath = () => window.location.pathname.substring(window.location.pathname.lastIndexOf('/')).replace('/', '')

const EditStopMapWithData = graphql(stopPlaceBBQuery, {
  options: {
    variables: {
      ignoreStopPlaceId: (getIdFromPath() && getIdFromPath() !== 'new') ? getIdFromPath() : "-1",
      latMin: 59.24675047197561,
      latMax: 59.341943796898505,
      lonMin: 0.94066619873047,
      lonMax: 11.186141967773438
    },
  }
})(EditStopMap)


export default injectIntl(connect(mapStateToProps)(EditStopMapWithData))


