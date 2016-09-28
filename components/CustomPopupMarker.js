import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'

class CustomPopupMarker extends React.Component {

  render() {

    let { children, position, handleOnClick, handleDragEnd, isQuay, markerIndex, stopIndex } = this.props

    if (!children && !children.length) {
      children = 'Uten navn'
    }

    const style = !isQuay ? {
      color: '#0086b3',
      cursor: "pointer"
    } : { color: '#00cc00' }

    return (
      <Marker
        ref="marker"
        key={"marker-key" + markerIndex }
        onDragend={() => { handleDragEnd(stopIndex, markerIndex, this.refs.marker) }}
        draggable={true}
        position={position}
        >
        <Popup>
          <div>
            <span style={style} onClick={handleOnClick}>{children}</span>
          </div>
        </Popup>
      </Marker>
    )
  }
}

export default CustomPopupMarker
