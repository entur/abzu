import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'

const CustomPopupMarker = ({ children, position, draggable, isQuay }) => {

  if (isQuay) {
    children += " (quay) "
  }
  
  return (
    <Marker draggable={draggable} position={position}>
      <Popup>
        <span>{children}</span>
      </Popup>
    </Marker>
  )
}

CustomPopupMarker.propTypes = {
  children: PropTypes.string,
  position: PropTypes.arrayOf(PropTypes.number),
}

export default CustomPopupMarker
