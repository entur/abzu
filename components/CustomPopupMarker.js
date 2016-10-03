import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'

class CustomPopupMarker extends React.Component {


  render() {

    let { children, position, handleOnClick,
          handleDragEnd, isQuay, markerIndex,
          stopIndex, changeCoordinates } = this.props

    if (!children && !children.length) {
      children = 'Uten navn'
    }

    const style = !isQuay ? {
      color: '#0086b3',
      cursor: "pointer"
    } : { color: '#00cc00' }

    const coordStyles = {
      display: 'block',
      marginTop: 5
    }

    const editCoordsStyle = {
      display: 'block',
      borderBottom: '1px dotted black',
      cursor: 'pointer'
    }

    var iconBase = L.Icon.extend({
      options: {
          iconUrl: "../static/icons/stop-icon-2x.png",
          shadowUrl: "../static/icons/marker-shadow.png",
          iconSize: [ 35, 45 ],
          iconAnchor: [ 17, 42 ],
          popupAnchor: [ 1, -32 ],
          shadowAnchor: [ 10, 12 ],
          shadowSize: [ 36, 16 ]
      }
    })

    const icon = new iconBase({
      iconUrl: (isQuay && stopIndex == 0) ? '../static/icons/quay-icon-2x.png'
        : (stopIndex == 0 && !isQuay)
        ? '../static/icons/stop-icon-2x.png' : '../static/icons/other-stop-icon-2x.png'
    })

    return (
      <Marker
        ref="marker"
        key={"marker-key" + markerIndex }
        onDragend={() => { handleDragEnd(stopIndex, markerIndex, this.refs.marker) }}
        draggable={true}
        position={position}
        icon={icon}
        >
        <Popup>
          <div>
            <span style={style} onClick={handleOnClick}>{children}</span>
            <div style={coordStyles}>
              <span style={{fontWeight: 600}}>Koordinater</span>
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
