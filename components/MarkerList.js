import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'

const MarkerList = ({ stops, handleDragEnd }) => {

  let popupMarkers = []

  stops.forEach(({ text, key, markerProps }, stopIndex) => {

    const quays = markerProps.quays

    popupMarkers.push((
      <CustomPopupMarker
        key={"custom-pm-parent"}
        index="-1"
        position={markerProps.position}
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
              position={[quay.centroid.location.latitude,
                quay.centroid.location.longitude
              ]}
              isQuay
              key={"custom-" + stopIndex + "-" + index}
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
