import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import MarkerList from '../components/MarkerList'
import leafletConfig from '../config/leafletConfig'
import LeafletMap from '../components/LeafletMap'
import { MapActions,  AjaxActions, UserActions } from '../actions/'
import { injectIntl } from 'react-intl'

class EditStopMap extends React.Component {

  handleClick(event, map) {
    let LeafletMap = map.leafletElemenet
  }

  handleDragEnd(stopIndex, markerIndex, marker) {
    const position = marker.leafletElement.getLatLng()
    this.props.dispatch( MapActions.changeMarkerPosition(stopIndex, markerIndex, position) )
  }

  handleMapMoveEnd(event, {leafletElement}) {

    let bounds = leafletElement.getBounds()
    let ignoreStopPlaceId = this.props.markers[0].value

    let boundingBox = {
      xMin: bounds.getSouthWest().lng,
      yMin: bounds.getSouthWest().lat,
      xMax: bounds.getNorthEast().lng,
      yMax: bounds.getNorthEast().lat
    }

    this.props.dispatch(AjaxActions.getStopsNearby(boundingBox, ignoreStopPlaceId))
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value))
  }

  handleChangeCoordinates(stopIndex, markerIndex, position) {
    const { formatMessage } = this.props.intl
    const defaultValue = position.join(',')
    const value = prompt(formatMessage({id: 'set_coordinates_prompt'}), defaultValue)
    // simple validation of coordinates
    if (value && value.length && value.split(',').length == 2
        && !isNaN(value.split(',')[0]) && !isNaN(value.split(',')[1])) {
      this.props.dispatch( MapActions.changeMarkerPosition(stopIndex, markerIndex, {
        lat: value.split(',')[0],
        lng: value.split(',')[1]
      }))
    }
  }

  render() {

    const { position, markers, zoom } = this.props

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
    markers: state.editStopReducer.activeStopPlace,
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
