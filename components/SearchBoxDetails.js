import React, { PropTypes } from 'react'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'
import ModalityIcon from '../components/ModalityIcon'
import {FormattedMessage} from 'react-intl'

const SearchBoxDetails = ({hidden, marker, handleEdit, text}) => {

  if (hidden) return null

  const style = {
    color: "#191919",
    border: "1px dotted #add8e6",
    padding: 5
  }

  const markerInfo = marker.markerProps

  return (
    <div style={style}>
      <h2>{markerInfo.name}</h2>
      {markerInfo.isMissingPosition
          ? <div className="warning_message">
              <FormattedMessage className='message_warning' id="is_missing_coordinates"/>
            </div>
        : null}
      <ModalityIcon
        iconStyle={{float: 'right', transform: 'translateY(-55px)'}}
        type={markerInfo.stopPlaceType}
        />
      <FlatButton
        onClick={() => handleEdit(markerInfo.id)}
        disabled={markerInfo.isMissingPosition}
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
