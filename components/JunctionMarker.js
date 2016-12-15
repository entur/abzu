import React, { Component, PropTypes } from 'react'
import { Marker } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
const entranceIcon = require("../static/icons/entrance-icon-2x.png")

class JunctionMarker extends React.Component {

  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    index: PropTypes.number.isRequired
  }

  render() {

    let { position } = this.props

    var icon = L.icon({
      iconUrl: entranceIcon,
      iconSize: [30, 45],
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16]
    })

    return (
      <Marker
        key={"junction-key" }
        draggable={true}
        position={position}
        icon={icon}
      >
      </Marker>
    )
  }
}

export default JunctionMarker
