import React from 'react'
import MarkerList from './MarkerList'

const LeafLetMap = ({lmapStyle, position, zoom, markers, LayersControl, Lmap, TileLayer, ZoomControl }) => {

  const { BaseLayer, Overlay } = LayersControl

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
      <MarkerList stops={markers}/>
    </Lmap>
  )
}

export default LeafLetMap
