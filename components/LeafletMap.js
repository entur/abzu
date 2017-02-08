import React from 'react'
import MarkerList from './MarkerList'
import { Map as Lmap, TileLayer, ZoomControl, LayersControl } from 'react-leaflet'
import { GoogleLayer } from 'react-leaflet-google'
import MultiPolylineList from './MultiPolylineList'
import WMTSLayer from './WMTSLayer'

export default class LeafLetMap extends React.Component {

  getCheckedBaseLayerByValue(value) {
    return this.props.activeBaselayer === value
  }

  handleBaselayerChanged(element) {
    this.props.handleBaselayerChanged(element.name)
  }

  getCenterPosition(position) {
    if (!position) {
      return [61.670029, 6.442342]
    }
    return Array.isArray(position)
      ? position.map( (pos) => Number(pos))
      : [Number(position.lat), Number(position.lng)]
  }

  getGKTToken() {
    // TODO : Query for this with /token
    return "C8B724CB848289B8264DFE5E1FA211E0774B4AD70DB980778DF829231A08590ADB1584C7A1E10204A7002ACA2E9D21402F15CFFEDCBD29AA8D018F0853CD0DA1"
  }

  render() {
    // NB: this key is owned by rutebanken.official
    const googleApiKey = 'AIzaSyBIobnzsLdanPxsH6n1tlySXeeUuMfMM8E'

    const { position, zoom, handleDragEnd, handleChangeCoordinates, handleOnClick, minZoom, handleSetCompassBearing } = this.props
    const { dragableMarkers, handleMapMoveEnd, onDoubleClick, newStopPlace, enablePolylines } = this.props

    let { markers } = this.props
    const { BaseLayer } = LayersControl

    if (newStopPlace && typeof newStopPlace == 'object') {
      markers = markers.concat(newStopPlace)
    }

    const lmapStyle = {
      height: "95%",
      width: "100%",
      border: "2px solid #eee"
    }

    const centerPosition = this.getCenterPosition(position)

    return (
      <Lmap ref='map'
        style={lmapStyle}
        center={centerPosition}
        zoom={zoom}
        zoomControl={false}
        maxZoom={18}
        minZoom={minZoom || null}
        onDblclick={ e => onDoubleClick && onDoubleClick(e, this.refs.map) }
        onMoveEnd={(event)=> { handleMapMoveEnd(event, this.refs.map)}}
        OnBaselayerChange={this.handleBaselayerChanged.bind(this)}
        onclick={(event) => { handleOnClick && handleOnClick(event, this.refs.map)} }
      >
        <LayersControl position='topright'>
          <BaseLayer checked={this.getCheckedBaseLayerByValue('Rutebankens kart')} name='Rutebankens kart'>
            <TileLayer
              attribution='&copy; <a href="http://test.rutebanken.org">Rutebankens kart'
              url='https://test.rutebanken.org/apiman-gateway/rutebanken/map/1.0/{z}/{x}/{y}.png'
            />
          </BaseLayer>
          <BaseLayer checked={this.getCheckedBaseLayerByValue('OpenStreetMap')} name='OpenStreetMap'>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </BaseLayer>
          <BaseLayer checked={this.getCheckedBaseLayerByValue('Google Maps Hydrid')} name='Google Maps Hydrid'>
            <GoogleLayer googlekey={googleApiKey} maptype='HYBRID'/>
          </BaseLayer>
          <BaseLayer checked={this.getCheckedBaseLayerByValue('Kartverket Flyfoto')} name='Kartverket Flyfoto'>
            <WMTSLayer
              gkt={this.getGKTToken()}
              baseURL="http://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2"
              zoom={zoom}
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position='bottomright' />
        <MarkerList
          changeCoordinates={handleChangeCoordinates} 
          stops={markers || []}
          handleDragEnd={handleDragEnd}
          dragableMarkers={dragableMarkers}
          handleSetCompassBearing={handleSetCompassBearing}
          />
        { enablePolylines
            ?
            <MultiPolylineList map={this.refs.map}/>
            : null }
      </Lmap>)
  }
}
