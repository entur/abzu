import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'

const MarkerList = ({ stops, handleDragEnd }) => {

  let popupMarkers = []

  stops.forEach(({ text, position, key, quays, markerProps }) => {

    // support both parent position (i.e. stop place) and quays
    quays = markerProps ? markerProps.quays : quays

    popupMarkers.push((
      <CustomPopupMarker
        key={"custom-pm-parent"}
        index="-1"
        position={position}
        key={"custom-pm-"}
        children={text}
        handleDragEnd={handleDragEnd}
      />
    ))

    if (quays) {

       quays.map( (quay, index) => {
          popupMarkers.push(
            <CustomPopupMarker
              index={index}
              position={{
                lat: quay.centroid.location.latitude,
                lng: quay.centroid.location.longitude
              }}
              isQuay
              key={"custom-pm-" + index}
              children={text}
              handleDragEnd={handleDragEnd}
            />)
        })
    }
  })

  return <div style={{display: 'none'}}>{popupMarkers}</div>
}

MarkerList.propTypes = {
  stops: PropTypes.array.isRequired,
  handleDragEnd: PropTypes.func.isRequired
}

export default MarkerList
