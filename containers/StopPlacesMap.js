import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import LeafletMap from '../components/LeafletMap'
import { MapActions, UserActions } from '../actions/'

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

  handleMapMoveEnd(event, { leafletElement }) {

    const center = leafletElement.getCenter()


    //TODO: Replace this with GraphQL fetch

    /*let zoom = map.leafletElement._zoom

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
    }*/
  }

  render() {

    const { position, markers, zoom } = this.props

    return (
      <LeafletMap
        position={position}
        markers={markers}
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

  const {
    newStop,
    centerPosition,
    activeSearchResult,
    zoom,
    neighbouringMarkers
  } = state.stopPlace

  const { isCreatingNewStop } = state.user

  let markers = activeSearchResult ? [ activeSearchResult ] : []

  if (newStop && isCreatingNewStop) {
    markers = markers.concat(newStop)
  }

  if (neighbouringMarkers && neighbouringMarkers.length) {
    markers = markers.concat(neighbouringMarkers)
  }

  return {
    position: centerPosition,
    markers: markers,
    zoom: zoom,
    isCreatingNewStop: state.user.isCreatingNewStop,
    activeBaselayer: state.user.activeBaselayer,
  }
}

export default connect(mapStateToProps)(StopPlacesMap)
