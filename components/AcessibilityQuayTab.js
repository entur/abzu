import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import WheelChairPopover from './WheelChairPopover'
import Stairs from '../static/icons/accessibility/Stairs'
import ToolTipIcon from './ToolTipIcon'
import Divider from 'material-ui/Divider'

class AcessibilityQuayTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stepFreeAccess: false
    }
  }

  render() {

    const { formatMessage } = this.props.intl
    const { stepFreeAccess } = this.state

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <WheelChairPopover displayLabel={true} intl={this.props.intl}/>
            <ToolTipIcon title={formatMessage({id: 'wheelChair_quay_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
       <div style={{marginTop: 10}}>
         <div style={{display: 'flex',justifyContent: 'space-between'}}>
           <Checkbox
             checkedIcon={<Stairs />}
             uncheckedIcon={<Stairs style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
             label={ !stepFreeAccess ? formatMessage({id: 'step_free_access'}) : formatMessage({id: 'step_free_access_no'}) }
             labelStyle={{fontSize: '0.8em'}}
             style={{width: '80%'}}
             checked={stepFreeAccess}
             onCheck={(e,v) => this.setState({stepFreeAccess: v})}
           />
           <ToolTipIcon title={formatMessage({id: 'step_free_access_quay_hint'})}/>
         </div>
         <Divider style={{marginTop: 10, marginBottom: 10}}/>
       </div>
      </div>
    )
  }
}

export default AcessibilityQuayTab