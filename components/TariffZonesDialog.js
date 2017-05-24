import React from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import MdDelete from 'material-ui/svg-icons/action/delete'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as altNameConfig from '../config/altNamesConfig'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import { StopPlaceActions } from '../actions/'
import ConfirmDialog from './ConfirmDialog'

class TariffZonesDialog extends React.Component {


  render() {

    const { open, intl, tariffZones = [], handleClose } = this.props
    const { formatMessage } = intl

    const translations = {
      value: formatMessage({id: 'name'}),
      tariffZones: formatMessage({id: 'tariffZones'}),
      noTariffZones: formatMessage({id: 'noTariffZones'})
    }

    if (!open) return null

    const style = {
      position: 'fixed',
      left: 400,
      top: 190,
      background: '#fff',
      border: '1px solid black',
      width: 350,
      zIndex: 999
    }

    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5}}>
          <div style={{marginTop: 8, fontWeight: 60, marginLeft: 10, fontWeight: 600}}>{ translations.tariffZones } </div>
          <IconButton style={{marginRight: 5}} onTouchTap={() => { handleClose() }}>
            <MdClose/>
          </IconButton>
        </div>
          <div style={{width: '100%', fontSize: 14, overflowY: 'overlay', maxHeight: 400, marginLeft: 15, marginBottom: 5}}>
            { !tariffZones.length
              ? <div style={{width: '100%', textAlign: 'center', marginBottom: 10, fontSize: 14}}> { translations.noTariffZones } </div>
              : (
                <div>
                  <div style={{fontWeight: 600}}>{translations.value}</div>
                  { tariffZones.map( (zone, i) => {
                    return (
                      <div key={"zone-" + i}>{zone.name}</div>
                    )
                  })
                  }
                </div>
              )
            }
          </div>
      </div>
    )
  }
}

export default connect(null)(TariffZonesDialog)