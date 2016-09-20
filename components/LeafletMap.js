import React from 'react'
import MarkerList from './MarkerList'
import { Map as Lmap, TileLayer, Popup, ZoomControl, LayersControl } from 'react-leaflet'

export default class LeafLetMap extends React.Component {

  render() {

    const { lmapStyle, position, zoom, markers, handleDragEnd, handleMapMoveEnd } = this.props

    const { BaseLayer, Overlay } = LayersControl

    return (
      <Lmap ref='map'
        style={lmapStyle}
        center={position}
        zoom={zoom}
        zoomControl={false}
        length={4}
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
        <MarkerList stops={markers || []} handleDragEnd={handleDragEnd}/>
      </Lmap>)
  }
}
