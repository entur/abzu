import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import LeafletMap from '../components/LeafletMap'
import { AjaxActions, MapActions, UserActions } from '../actions/'

class StopPlacesMap extends React.Component {

  handleClick(e, map) {
    const { isCreatingNewStop } = this.props

    if (isCreatingNewStop) {
      map.leafletElement.doubleClickZoom.disable()
      this.props.dispatch( MapActions.createNewStop(e.latlng) )
    } else {
      map.leafletElement.doubleClickZoom.enable()
    }

  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value))
  }

  handleDragEnd(marker, index) {
  }

  handleMapMoveEnd(event, map) {
    let zoom = map.leafletElement._zoom

    if (zoom > 12) {

      let bounds = map.leafletElement.getBounds()

      let boundingBox = {
        xMin: bounds.getSouthWest().lng,
        yMin: bounds.getSouthWest().lat,
        xMax: bounds.getNorthEast().lng,
        yMax: bounds.getNorthEast().lat
      }

      this.props.dispatch(AjaxActions.getStopsNearbyForOverview(boundingBox))
    } else {
      this.props.dispatch(UserActions.removeStopsNearbyForOverview())
    }
  }

  render() {

    const { position, activeMarker, neighbouringMarkers, zoom, newStopPlace } = this.props

    let markers = activeMarker ? [activeMarker] : []

    if (neighbouringMarkers && neighbouringMarkers.length) {
      markers = markers.concat(neighbouringMarkers)
    }

    return (
      <LeafletMap
        position={position}
        markers={markers}
        newStopPlace={newStopPlace}
        zoom={zoom}
        onDoubleClick={this.handleClick.bind(this)}
        handleDragEnd={this.handleDragEnd}
        handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
        dragableMarkers={false}
        activeBaselayer={this.props.activeBaselayer}
        handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
        enablePolylines={false}
        />
    )
  }
}

const mapStateToProps = state => {
  const { centerPosition, activeMarker, zoom, newStopPlace, neighbouringMarkers } = state.stopPlaces
  return {
    position: centerPosition,
    activeMarker: activeMarker,
    zoom: zoom,
    newStopPlace: newStopPlace,
    isCreatingNewStop: state.user.isCreatingNewStop,
    activeBaselayer: state.user.activeBaselayer,
    neighbouringMarkers: neighbouringMarkers
  }
}

export default connect(mapStateToProps)(StopPlacesMap)
