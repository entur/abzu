import React, { PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'

const SearchBoxDetails = ({hidden, marker, handleEdit, text}) => {

  if (hidden) return null

  const style = {
    color: "#191919",
    border: "1px dotted #add8e6",
    padding: 5
  }

  const markerInfo = marker.markerProps

  const description =
    markerInfo.description || text.emptyDescription

  return (
    <div style={style}>
      <h2>{markerInfo.name}</h2>
      <p>{description}</p>
      <FlatButton
        onClick={() => handleEdit(markerInfo.id)}
        >
        <Edit style={{width: 16, verticalAlign: "middle", height: 16}}/>
        <span style={{fontSize: ".8em", marginLeft: 5}}>
          { text.edit }
        </span>
      </FlatButton>
    </div>
  )
}

export default SearchBoxDetails
