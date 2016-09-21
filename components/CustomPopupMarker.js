import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'

class CustomPopupMarker extends React.Component {

  render() {

    let { children, position, handleOnClick, handleDragEnd, isQuay, markerIndex, stopIndex } = this.props

    if (isQuay) {
      children += ` (quay ${markerIndex+1})`
    }

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
            <span onClick={handleOnClick}>{children}</span>
          </div>
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
