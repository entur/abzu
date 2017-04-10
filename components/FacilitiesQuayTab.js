import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import Divider from 'material-ui/Divider'
import ToolTipIcon from './ToolTipIcon'

class FacilitiesQuayTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ticketMachine: false,
      busShelter: false
    }
  }

  render() {

    const { formatMessage } = this.props.intl
    const { ticketMachine, busShelter } = this.state

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<TicketMachine />}
              uncheckedIcon={<TicketMachine style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ ticketMachine ? formatMessage({id: 'ticketMachine'}) : formatMessage({id: 'ticketMachine_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              checked={ticketMachine}
              onCheck={ (e,v) => this.setState({ticketMachine: v}) }
            />
            <ToolTipIcon title={formatMessage({id: 'ticketMachine_quay_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<BusShelter />}
              uncheckedIcon={<BusShelter  style={{fill: '#8c8c8c', opacity: '0.8'}} />}
              label={ busShelter ? formatMessage({id: 'busShelter'}) : formatMessage({id: 'busShelter_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              checked={busShelter}
              onCheck={ (e,v) => this.setState({busShelter: v}) }
            />
            <ToolTipIcon title={formatMessage({id: 'busShelter_quay_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
      </div>
    )
  }
}

export default FacilitiesQuayTab