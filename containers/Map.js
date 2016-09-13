import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { Map as Lmap, TileLayer, Popup, ZoomControl, LayersControl } from 'react-leaflet'
import MarkerList from '../components/MarkerList'
import leafletConfig from '../config/leafletConfig'

const { BaseLayer, Overlay } = LayersControl

class Map extends React.Component {


  render() {

    const { position, markers, zoom } = this.props

    const lmapStyle = {
      height: "800px",
      width: "100%",
      border: "2px solid #eee"
    }

    return (
      <Lmap style={lmapStyle} center={position} zoom={zoom} zoomControl={false}>
        <LayersControl position='topright'>
          <BaseLayer checked name='Rutebankens kart'>
            <TileLayer
              attribution='&copy; <a href="http://test.rutebanken.org">Rutebankens kart'
              url='https://test.rutebanken.org/apiman-gateway/rutebanken/map/1.0/{z}/{x}/{y}.png'
            />
          </BaseLayer>
          <BaseLayer name='OpenStreetMap'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position='bottomright' />
        <MarkerList markers={markers} />
      </Lmap>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    position: state.mapReducer.centerPosition,
    markers: state.mapReducer.activeMarkers,
    zoom: state.mapReducer.zoom
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
)(Map)
