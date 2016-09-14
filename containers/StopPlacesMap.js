import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { Map as Lmap, TileLayer, Popup, ZoomControl, LayersControl } from 'react-leaflet'
import LeafLetMap from '../components/LeafLetMap'

class StopPlacesMap extends React.Component {

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
        LayersControl={LayersControl}
        Lmap={Lmap}
        TileLayer={TileLayer}
        ZoomControl={ZoomControl}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    position: state.stopPlacesReducer.centerPosition,
    markers: state.stopPlacesReducer.activeMarkers,
    zoom: state.stopPlacesReducer.zoom,
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
)(StopPlacesMap)
