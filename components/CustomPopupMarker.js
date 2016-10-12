import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
const markerShadow = require("../static/icons/marker-shadow.png")
const stopIcon = require("../static/icons/stop-icon-2x.png")
const quayIcon = require('../static/icons/quay-icon-2x.png')
const otherStopIcon = require('../static/icons/other-stop-icon-2x.png')

class CustomPopupMarker extends React.Component {

  render() {

    let { children, position, handleOnClick,
          handleDragEnd, isQuay, markerIndex, draggable,
          stopIndex, changeCoordinates, text  } = this.props

    if (!children && !children.length) {
      children = text.untitled
    }

    const style = !isQuay ? {
      color: '#0086b3',
      cursor: "pointer"
    } : { color: '#00cc00' }

    const coordStyles = {
      display: 'block',
      marginTop: 5
    }

    const iconSize = isQuay ? [22, 33] : [30, 45]
    const iconAnchor = isQuay ? [11, 28] : [17, 42]
    const shadowAnchor = isQuay ? [11, 8] : [10, 12]

    const editCoordsStyle = {
      display: 'block',
      borderBottom: '1px dotted black',
      cursor: 'pointer'
    }

    var iconBase = L.Icon.extend({
      options: {
          iconUrl: stopIcon,
          shadowUrl: markerShadow,
          iconSize: iconSize,
          iconAnchor: iconAnchor,
          popupAnchor: [ 1, -32 ],
          shadowAnchor: shadowAnchor,
          shadowSize: [ 36, 16 ]
      }
    })

    const icon = new iconBase({
      iconUrl: (isQuay && stopIndex == 0) ? quayIcon
        : (stopIndex == 0 && !isQuay)
        ? stopIcon : otherStopIcon
    })

    return (
      <Marker
        ref="marker"
        key={"marker-key" + markerIndex }
        onDragend={() => { handleDragEnd(stopIndex, markerIndex, this.refs.marker) }}
        draggable={draggable}
        position={position}
        icon={icon}
        >
        <Popup>
          <div>
            <span style={style} onClick={handleOnClick}>{children}</span>
            <div style={coordStyles}>
              <span style={{fontWeight: 600}}>{text.coordinates}</span>
                <div
                  style={editCoordsStyle}
                  onClick={() => changeCoordinates && changeCoordinates(stopIndex, markerIndex, position)}
                  >
                  <span>{position[0]},</span>
                  <span style={{marginLeft: 2}}>{position[1]}</span>
                </div>
            </div>
          </div>
        </Popup>
      </Marker>
    )
  }
}

export default CustomPopupMarker
