import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import NoTicketMachine from '../static/icons/facilities/NoTicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import NoBusShelter from '../static/icons/facilities/NoBusShelter'
import MdHelp from 'material-ui/svg-icons/action/help'
import Divider from 'material-ui/Divider'

class FacilitiesTab extends React.Component {

  render() {

    const { formatMessage } = this.props.intl


    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<TicketMachine />}
              uncheckedIcon={<NoTicketMachine />}
              label={formatMessage({id: 'ticketMachine'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <MdHelp color="orange"/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<BusShelter />}
              uncheckedIcon={<NoBusShelter />}
              label={formatMessage({id: 'busShelter'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <MdHelp color="orange"/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
      </div>
    )
  }
}

export default FacilitiesTab