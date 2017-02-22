import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import MdHelp from 'material-ui/svg-icons/action/help'
import Divider from 'material-ui/Divider'
import MdWc from 'material-ui/svg-icons/notification/wc'
import WaitingRoom from '../static/icons/facilities/WaitingRoom'
import ToolTipIcon from './ToolTipIcon'


class FacilitiesStopTab extends React.Component {

  render() {

    const { formatMessage } = this.props.intl

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<TicketMachine />}
              uncheckedIcon={<TicketMachine />}
              label={formatMessage({id: 'ticketMachine'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <ToolTipIcon title={formatMessage({id: 'ticketMachine_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<BusShelter />}
              uncheckedIcon={<BusShelter />}
              label={formatMessage({id: 'busShelter'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <ToolTipIcon title={formatMessage({id: 'busShelter_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<MdWc />}
              uncheckedIcon={<MdWc />}
              label={formatMessage({id: 'wc'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <ToolTipIcon title={formatMessage({id: 'wc_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checkedIcon={<WaitingRoom />}
              uncheckedIcon={<WaitingRoom />}
              label={formatMessage({id: 'waiting_room'})}
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '45%'}}
            />
            <ToolTipIcon title={formatMessage({id: 'waitingroom_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
      </div>
    )
  }
}

export default FacilitiesStopTab