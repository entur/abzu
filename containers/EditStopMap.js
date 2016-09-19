import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import MarkerList from '../components/MarkerList'
import leafletConfig from '../config/leafletConfig'
import LeafLetMap from '../components/LeafLetMap'
import MapActionCreator from '../actions/MapActionCreator'

class EditStopMap extends React.Component {

  handleClick(event, map) {
    let LeafLetMap = map.leafletElemenet
  }

  handleDragEnd(marker, index) {
    const position = marker.leafletElement.getLatLng()
    this.props.dispatch( MapActionCreator.changeQuayPosition(index, position) )
  }

  render() {

    const { position, markers, zoom } = this.props

    const lmapStyle = {
      height: "800px",
      width: "100%",
      border: "2px solid #eee"
    }

    return (
      <LeafLetMap
        position={position}
        markers={markers}
        zoom={zoom}
        lmapStyle={lmapStyle}
        onClick={this.handleClick}
        handleDragEnd={::this.handleDragEnd}
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
