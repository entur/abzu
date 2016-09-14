import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'

const MarkerList = ({ stops }) => {

  if (!stops.length) return null

  const items = stops.map(({ quays, draggable, key, ...props }) => {
    
    let popupMarkers = []
    let quayPopupMarkers = quays
      .map( (quay, index) => {
        const position = [quay.centroid.location.latitude, quay.centroid.location.longitude]
        return (
          <CustomPopupMarker
            draggable={draggable}
            key={key + "-quay" + index}
            draggable
            position={position}
            isQuay
            children={quay.name}
          />)
      })

    popupMarkers.push((<CustomPopupMarker draggable={draggable} key={key} {...props} />))
    popupMarkers.push(quayPopupMarkers)

    return popupMarkers

  }).reduce( (prev, curr) => curr.concat(prev))

  return <div style={{display: 'none'}}>{items}</div>
}

MarkerList.propTypes = {
  stops: PropTypes.array.isRequired,
}

export default MarkerList
