import React from 'react'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'
import ModalityIcon from '../components/ModalityIcon'
import { FormattedMessage } from 'react-intl'
import Warning from 'material-ui/svg-icons/alert/warning'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'


const SearchBoxDetails = ({text, result, handleEdit, handleChangeCoordinates, userSuppliedCoordinates, canEdit}) => {

  const style = {
    color: "#fefefe",
    border: "1px dotted #add8e6",
    padding: 5
  }

  return (
    <div style={style}>
      <h2>{result.name}</h2>
      { !userSuppliedCoordinates && result.isMissingLocation
          ? <div className="warning_message">
              <Warning style={{verticalAlign: 'sub', fill: 'rgb(214, 134, 4)'}}/>
              <FormattedMessage className='message_warning' id="is_missing_coordinates"/>
              <div style={{marginTop: 2, marginBottom: 10}}>
                <span
                  style={{borderBottom: '1px dotted', color: 'rgb(0, 188, 212)', fontWeight: 600, marginBottom: 10, fontSize: '0.8em', cursor: 'pointer'}}
                  onClick={() => handleChangeCoordinates()}
                >
                  <FormattedMessage className='message_warning_helper_text' id="is_missing_coordinates_help_text"/>
                </span>
              </div>
        </div>
        : null}

      {
        userSuppliedCoordinates && result.isMissingLocation
          ? <div className="warning_message">
            <FormattedMessage className='message_warning' id="you_are_using_temporary_coordinates"/>
            <div style={{marginTop: 5, marginBottom: 10}}>
                <span
                  style={{borderBottom: '1px dotted', color: 'rgb(0, 188, 212)', fontWeight: 600, marginBottom: 10, fontSize: '0.8em', cursor: 'pointer'}}
                  onClick={() => handleChangeCoordinates()}
                >
                  <FormattedMessage className='message_warning_helper_text' id="change_coordinates"/>
                </span>
            </div>
          </div>
          : null
      }

      <ModalityIcon
        iconStyle={{float: 'right', transform: 'translateY(-55px)'}}
        type={result.stopPlaceType}
        />
      <FlatButton
        onClick={() => handleEdit(result.id)}
        >
        { canEdit ?
          <Edit style={{width: 16, verticalAlign: "middle", height: 16}}/>
          : <MapsMyLocation style={{width: 16, verticalAlign: "middle", height: 16}}/>
        }
        <span style={{fontSize: ".8em", marginLeft: 5}}>
          { canEdit ? text.edit : text.view }
        </span>
      </FlatButton>
    </div>
  )
}

export default SearchBoxDetails
