import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'

class CustomPopupMarker extends React.Component {

  render() {

    let { children, position, handleDragEnd, isQuay, index } = this.props

    if (isQuay) {
      children += ` (quay ${index+1})`
    }

    return (
      <Marker ref="marker" key={"marker-key" + index } onDragend={() => { handleDragEnd(this.refs.marker, index) }} draggable={true} position={position}>
        <Popup>
          <span>{children}</span>
        </Popup>
      </Marker>
    )
  }
}

CustomPopupMarker.propTypes = {
  children: PropTypes.string,
  isQuay: PropTypes.bool,
  positon: PropTypes.object
}

export default CustomPopupMarker
