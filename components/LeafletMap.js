import React from 'react'
import MarkerList from './MarkerList'
import MarkerCluster from './MarkerCluster'
import { Map as Lmap, TileLayer, Popup, ZoomControl, LayersControl } from 'react-leaflet'

export default class LeafLetMap extends React.Component {

  render() {

    const { position, zoom, handleDragEnd, handleChangeCoordinates } = this.props
    const { dragableMarkers, handleMapMoveEnd, onDoubleClick, newStopPlace } = this.props

    let { markers } = this.props
    const { BaseLayer, Overlay } = LayersControl

    if (newStopPlace && typeof newStopPlace == 'object') {
      markers = markers.concat(newStopPlace)
    }

    const lmapStyle = {
      height: "95%",
      width: "100%",
      border: "2px solid #eee"
    }

    return (
      <Lmap ref='map'
        style={lmapStyle}
        center={position}
        zoom={zoom}
        zoomControl={false}
        length={4}
        onDblclick={ e => onDoubleClick && onDoubleClick(e, this.refs.map) }
        onMoveEnd={(event)=> { handleMapMoveEnd(event, this.refs.map)}}
      >
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
        <MarkerCluster>
          <MarkerList
            changeCoordinates={handleChangeCoordinates} 
            stops={markers || []}
            handleDragEnd={handleDragEnd}
            dragableMarkers={dragableMarkers}
            />
        </MarkerCluster>
      </Lmap>)
  }
}
