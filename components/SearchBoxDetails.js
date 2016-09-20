import React, { PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

const SearchBoxDetails = ({hidden, marker, handleEdit}) => {


  if (hidden) return null

  const style = {
    color: "#191919",
    paddingTop: "40px"
  }

  const markerInfo = marker.markerProps

  const description =
    markerInfo.description || "Det ser ut som ditt stoppested mangler en beskrivelse ..."

  return (
    <div style={style}>
      <h2>{markerInfo.name}</h2>
      <p>{description}</p>
      <button onClick={() => handleEdit(markerInfo.id)}>edit</button>
    </div>
  )
}

export default SearchBoxDetails
