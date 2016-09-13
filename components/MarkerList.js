import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'

const MarkerList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <CustomPopupMarker key={key} {...props} />
  ))

  return <div style={{display: 'none'}}>{items}</div>
}

MarkerList.propTypes = {
  markers: PropTypes.array.isRequired,
}

export default MarkerList
