import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import WheelChair from 'material-ui/svg-icons/action/accessible'
import Stairs from '../static/icons/accessibility/Stairs'
import ToolTipIcon from './ToolTipIcon'
import Divider from 'material-ui/Divider'

class AcessibilityStopTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      wheelChairFriendly: false,
      stepFreeAccess: false
    }
  }

  render() {

    const { formatMessage } = this.props.intl
    const { wheelChairFriendly, stepFreeAccess } = this.state

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checked={wheelChairFriendly}
              checkedIcon={<WheelChair />}
              uncheckedIcon={<WheelChair style={{fill: '#8c8c8c', opacity: '0.8'}} />}
              label={ wheelChairFriendly ? formatMessage({id: 'wheelchairAccess'}) : formatMessage({id: 'wheelchairAccess_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => this.setState({wheelChairFriendly: v})}
            />
            <ToolTipIcon title={formatMessage({id: 'wheelchair_stop_hint'})} />
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
       <div style={{marginTop: 10}}>
         <div style={{display: 'flex', justifyContent: 'space-between'}}>
           <Checkbox
             checked={stepFreeAccess}
             checkedIcon={<Stairs />}
             uncheckedIcon={<Stairs style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
             label={ stepFreeAccess ? formatMessage({id: 'step_free_access'}) : formatMessage({id: 'step_free_access_no'}) }
             labelStyle={{fontSize: '0.8em'}}
             style={{width: '80%'}}
             onCheck={(e,v) => this.setState({stepFreeAccess: v})}
           />
           <ToolTipIcon title={formatMessage({id: 'step_free_access_hint'})} />
         </div>
         <Divider style={{marginTop: 10, marginBottom: 10}}/>
       </div>
      </div>
    )
  }
}

export default AcessibilityStopTab