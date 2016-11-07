import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import MarkerList from '../components/MarkerList'
import leafletConfig from '../config/leafletConfig'
import LeafletMap from '../components/LeafletMap'
import { MapActions,  AjaxActions, UserActions } from '../actions/'
import { injectIntl } from 'react-intl'
import { setDecimalPrecision } from '../utils'

class EditStopMap extends React.Component {

  handleClick(event, map) {
    let LeafletMap = map.leafletElemenet
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

  handleMapMoveEnd(event, {leafletElement}) {

    let bounds = leafletElement.getBounds()
    let ignoreStopPlaceId = this.props.stopPlaceMarker.markerProps.id

    let boundingBox = {
      xMin: bounds.getSouthWest().lng,
      yMin: bounds.getSouthWest().lat,
      xMax: bounds.getNorthEast().lng,
      yMax: bounds.getNorthEast().lat
    }

    this.props.dispatch(AjaxActions.getStopsNearbyForEditingStop(boundingBox, ignoreStopPlaceId))
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value))
  }

  handleChangeCoordinates(isQuay, quayIndex, position) {
    const { formatMessage } = this.props.intl
    const defaultValue = position.join(',')
    const value = prompt(formatMessage({id: 'set_coordinates_prompt'}), defaultValue)
    // simple validation of coordinates
    if (value && value.length && value.split(',').length == 2
        && !isNaN(value.split(',')[0]) && !isNaN(value.split(',')[1])) {

      if (isQuay) {
        this.props.dispatch( MapActions.changeQuayPosition(quayIndex, {
          lat: Number(value.split(',')[0]),
          lng: Number(value.split(',')[1])
        }))
      } else {
        this.props.dispatch( MapActions.changeActiveStopPosition({
          lat: Number(value.split(',')[0]),
          lng: Number(value.split(',')[1])
        }))
      }
    }
  }

  render() {

    const { position, stopPlaceMarker, neighbouringMarkers, zoom } = this.props

    let markers = []

    if (stopPlaceMarker) {
      markers = markers.concat(stopPlaceMarker)
    }

    if (neighbouringMarkers && neighbouringMarkers.length) {
      markers = markers.concat(neighbouringMarkers)
    }

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        onClick={this.handleClick}
        handleDragEnd={this.handleDragEnd.bind(this)}
        handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
        handleChangeCoordinates={this.handleChangeCoordinates.bind(this)}
        dragableMarkers={true}
        activeBaselayer={this.props.activeBaselayer}
        handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
        />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    position: state.editStopReducer.centerPosition,
    stopPlaceMarker: state.editStopReducer.activeStopPlace,
    neighbouringMarkers: state.editStopReducer.neighbouringMarkers,
    zoom: state.editStopReducer.zoom,
    lastUpdated: state.editStopReducer.lastUpdated,
    activeBaselayer: state.userReducer.activeBaselayer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStopMap))
