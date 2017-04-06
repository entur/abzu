import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import Divider from 'material-ui/Divider'
import MdWc from 'material-ui/svg-icons/notification/wc'
import WaitingRoom from '../static/icons/facilities/WaitingRoom'
import ToolTipIcon from './ToolTipIcon'
import BikeParking from '../static/icons/facilities/BikeParking'


class FacilitiesStopTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ticketMachine: false,
      busShelter: false,
      WC: false,
      waitingRoom: false,
      bikeParking: false,
    }
  }

  render() {

    const { disabled, intl } = this.props
    const { formatMessage } = intl
    const { ticketMachine, busShelter, WC, waitingRoom, bikeParking } = this.state

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={ticketMachine}
              disabled={disabled}
              checkedIcon={<TicketMachine />}
              uncheckedIcon={<TicketMachine style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ ticketMachine ? formatMessage({id: 'ticketMachine'}) : formatMessage({id: 'ticketMachine_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({ticketMachine: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'ticketMachine_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checked={busShelter}
              disabled={disabled}
              checkedIcon={<BusShelter />}
              uncheckedIcon={<BusShelter style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ busShelter ? formatMessage({id: 'busShelter'}) : formatMessage({id: 'busShelter_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({busShelter: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'busShelter_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={WC}
              disabled={disabled}
              checkedIcon={<MdWc />}
              uncheckedIcon={<MdWc style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ WC ? formatMessage({id: 'wc'}) : formatMessage({id: 'wc_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({WC: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'wc_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={waitingRoom}
              disabled={disabled}
              checkedIcon={<WaitingRoom />}
              uncheckedIcon={<WaitingRoom style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ waitingRoom ? formatMessage({id: 'waiting_room'}) : formatMessage({id: 'waiting_room_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({waitingRoom: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'waitingroom_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={bikeParking}
              disabled={disabled}
              checkedIcon={<BikeParking />}
              uncheckedIcon={<BikeParking style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ bikeParking ? formatMessage({id: 'bike_parking'}) : formatMessage({id: 'bike_parking_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({bikeParking: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'bike_parking_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 0}}/>
        </div>
      </div>
    )
  }
}

export default FacilitiesStopTab