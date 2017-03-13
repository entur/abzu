import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ParkingIcon from '../static/icons/parking-icon.png'
import { connect } from 'react-redux'

class ParkingMarker extends React.Component {

  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    index: PropTypes.number.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  }

  componentDidUpdate() {
    const { focusedElement, index, type } = this.props
    const isFocused = (focusedElement.type === type && index === focusedElement.index)
    if (isFocused) {
      L.DomUtil.addClass(this.refs.marker.leafletElement._icon, 'focused')
    }
    L.DomUtil.addClass(this.refs.marker.leafletElement._icon, 'padded-10')
  }

  render() {

    const { position, index, handleDragEnd, title } = this.props

    const icon = L.icon({
      iconUrl: ParkingIcon,
      iconSize: [25, 36],
      iconAnchor: [-3, 40],
      popupAnchor: [15, 0],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16]
    })

    return (
      <Marker
        draggable={true}
        position={position}
        icon={icon}
        onDragend={(event) => { handleDragEnd(index, 'parking', event) }}
        ref="marker"
      >
        <Popup>
          <div>
            <div style={{fontWeight: 600, textAlign: 'center', margin: '5 0', fontSize: '1.1em'}}>P+R</div>
            <div className="parking-marker-title" style={{marginTop: -2, marginBottom: 5, fontSize: '1em', color: '#191919'}}>{title}</div>
          </div>
        </Popup>
      </Marker>
    )
  }
}

const mapStateToProps = state => {
  return {
    focusedElement: state.editingStop.focusedElement
  }
}

export default connect(mapStateToProps)(ParkingMarker)

