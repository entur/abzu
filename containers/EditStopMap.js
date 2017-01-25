import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import LeafletMap from '../components/LeafletMap'
import { MapActions,  AjaxActions, UserActions } from '../actions/'
import { injectIntl } from 'react-intl'
import { setDecimalPrecision } from '../utils'
import CoordinatesDialog from '../components/CoordinatesDialog'
import CompassBearingDialog from '../components/CompassBearingDialog'

class EditStopMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinatesDialogOpen: false,
      compassBearingDialogOpen: false
    }
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
      dispatch(MapActions.changeActiveStopPosition(formattedPosition))
    }
  }

  handleSetCompassBearing(compassBearing, index) {
    this.setState({
      compassBearingDialogOpen: true,
      compassBearing: compassBearing,
      compassBearingOwner: index
    })
  }

  handleMapMoveEnd(event, {leafletElement}) {

    if (this.props.stopPlaceMarker) {

      let bounds = leafletElement.getBounds()
      let ignoreStopPlaceId = this.props.stopPlaceMarker.markerProps.id

      let boundingBox = {
        xMin: bounds.getSouthWest().lng,
        yMin: bounds.getSouthWest().lat,
        xMax: bounds.getNorthEast().lng,
        yMax: bounds.getNorthEast().lat
      }
      this.props.dispatch(AjaxActions.getStopsNearbyForEditingStop(boundingBox, ignoreStopPlaceId, leafletElement))
    }
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
      dispatch(MapActions.changeActiveStopPosition(position))
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

    const { position, stopPlaceMarker, neighbouringMarkers, zoom, missingCoordsMap } = this.props
    const { coordinatesDialogOpen, compassBearingDialogOpen } =  this.state

    let markers = []

    if (stopPlaceMarker) {
      markers = markers.concat(stopPlaceMarker)
    }

    if (neighbouringMarkers && neighbouringMarkers.length) {
      markers = markers.concat(neighbouringMarkers)
    }

    let minZoom = 5

    // Restricts zoom level if coordinates are provided either by the user or from backend
    if (stopPlaceMarker && stopPlaceMarker.markerProps && !stopPlaceMarker.markerProps.position) {
      if (!missingCoordsMap[stopPlaceMarker.markerProps.id]) {
        minZoom = 15
      }
    }

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

const mapStateToProps = (state, ownProps) => {
  return {
    position: state.editStopReducer.centerPosition,
    stopPlaceMarker: state.editStopReducer.activeStopPlace,
    neighbouringMarkers: state.editStopReducer.neighbouringMarkers,
    zoom: state.editStopReducer.zoom,
    lastUpdated: state.editStopReducer.lastUpdated,
    activeBaselayer: state.userReducer.activeBaselayer,
    enablePolylines: state.editStopReducer.enablePolylines,
    isCreatingPolylines: state.editStopReducer.isCreatingPolylines,
    missingCoordsMap: state.userReducer.missingCoordsMap,
  }
}

export default injectIntl(connect(mapStateToProps)(EditStopMap))
