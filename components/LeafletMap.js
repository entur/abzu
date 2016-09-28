import React from 'react'
import MarkerList from './MarkerList'
import MarkerCluster from './MarkerCluster'

import { Map as Lmap, TileLayer, Popup, ZoomControl, LayersControl } from 'react-leaflet'

export default class LeafLetMap extends React.Component {

  render() {

    const { lmapStyle, position, zoom, handleDragEnd, handleMapMoveEnd, onDoubleClick, newStopPlace } = this.props
    let { markers } = this.props
    const { BaseLayer, Overlay } = LayersControl

    if (newStopPlace && typeof newStopPlace == 'object') {
      markers = markers.concat(newStopPlace)
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
          <MarkerList stops={markers || []} handleDragEnd={handleDragEnd}/>
        </MarkerCluster>
      </Lmap>)
  }
}
