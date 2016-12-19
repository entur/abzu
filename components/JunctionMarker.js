import React, { Component, PropTypes } from 'react'
import { Marker } from 'react-leaflet'
import L, { divIcon } from 'leaflet'

class JunctionMarker extends React.Component {

  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    index: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    handleDragEnd: PropTypes.func.isRequired
  }

  render() {

    let { position, index, type, handleDragEnd } = this.props

    let iconURL = type === 'entrance'
      ? require("../static/icons/entrance-icon-2x.png")
      : require("../static/icons/junction-icon-2x.png")

    var icon = L.icon({
      iconUrl: iconURL,
      iconSize: [30, 45],
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16]
    })

    return (
      <Marker
        draggable={true}
        position={position}
        icon={icon}
        onDragend={(event) => { handleDragEnd(index, type, event) }}
      >
      </Marker>
    )
  }
}

export default JunctionMarker
