import React, { PropTypes } from 'react'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'
import ModalityIcon from '../components/ModalityIcon'
import { FormattedMessage } from 'react-intl'
import Warning from 'material-ui/svg-icons/alert/warning'


const SearchBoxDetails = ({marker, handleEdit, text, handleChangeCoordinates, userSuppliedCoordinates}) => {

  const style = {
    color: "#191919",
    border: "1px dotted #add8e6",
    padding: 5
  }

  const markerInfo = marker.markerProps

  return (
    <div style={style}>
      <h2>{markerInfo.name}</h2>
      { !userSuppliedCoordinates && markerInfo.isMissingPosition
          ? <div className="warning_message">
              <Warning style={{verticalAlign: 'sub', fill: 'rgb(214, 134, 4)'}}/>
              <FormattedMessage className='message_warning' id="is_missing_coordinates"/>
              <div style={{marginTop: 2, marginBottom: 10}}>
                <span
                  style={{borderBottom: '1px dotted', color: 'rgb(0, 188, 212)', fontWeight: 600, marginBottom: 10, fontSize: '0.8em', cursor: 'pointer'}}
                  onClick={() => handleChangeCoordinates()}
                >
                  Klikk her for å sette midlertidige koordinater.
                </span>
              </div>
        </div>
        : null}
      <ModalityIcon
        iconStyle={{float: 'right', transform: 'translateY(-55px)'}}
        type={markerInfo.stopPlaceType}
        />
      <FlatButton
        onClick={() => handleEdit(markerInfo.id)}
        disabled={!userSuppliedCoordinates && markerInfo.isMissingPosition}
        style={{opacity: !userSuppliedCoordinates && markerInfo.isMissingPosition ? 0.5 : 1}}
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
