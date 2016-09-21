import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import MarkerList from '../components/MarkerList'
import leafletConfig from '../config/leafletConfig'
import LeafletMap from '../components/LeafletMap'
import { MapActions,  AjaxActions } from '../actions/'

class EditStopMap extends React.Component {

  handleClick(event, map) {
    let LeafletMap = map.leafletElemenet
  }

  handleDragEnd(stopIndex, markerIndex, marker) {
    const position = marker.leafletElement.getLatLng()
    this.props.dispatch( MapActions.changeQuayPosition(stopIndex, markerIndex, position) )
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

    this.props.dispatch(  AjaxActions.getStopsNearby(boundingBox, ignoreStopPlaceId) )
  }

  render() {

    const { position, markers, zoom } = this.props

    const lmapStyle = {
      height: "800px",
      width: "100%",
      border: "2px solid #eee"
    }

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        lmapStyle={lmapStyle}
        onClick={this.handleClick}
        handleDragEnd={::this.handleDragEnd}
        handleMapMoveEnd={::this.handleMapMoveEnd}
        />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    position: state.editStopReducer.centerPosition,
    markers: state.editStopReducer.activeStopPlace,
    zoom: state.editStopReducer.zoom,
    lastUpdated: state.editStopReducer.lastUpdated
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStopMap)
