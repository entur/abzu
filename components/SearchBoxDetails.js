import React, { PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

const SearchBoxDetails = ({hidden, marker}) => {

  if (hidden) return null

  if (marker.description == null) {
    marker.description = "Det ser ut som ditt stoppested mangler en beskrivelse ..."
  }

  const style = {
    color: "#191919",
    paddingTop: "40px"
  }

  return (
    <div style={style}>
      <h2>{marker.children}</h2>
      <p>{marker.description}</p>
      <button onClick={() => browserHistory.push('/edit')}>edit</button>
    </div>
  )

}

export default SearchBoxDetails
