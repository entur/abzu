import React from 'react'
import WheelChairPopover from './WheelChairPopover'
import StepFreePopover from './StepFreePopover'
import ToolTipIcon from './ToolTipIcon'
import Divider from 'material-ui/Divider'
import { getIn } from '../utils/'
import { connect } from 'react-redux'
import { AssessmentActions } from '../actions/'


class AcessibilityQuayTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stepFreeAccess: false
    }
  }

  handleWheelChairChange(value) {
    this.props.dispatch(AssessmentActions.setQuayWheelchairAccess(value, this.props.index))
  }

  handleStepFreeChange(value) {
    this.props.dispatch(AssessmentActions.setQuayStepFreeAccess(value, this.props.index))
  }


  render() {

    const { intl, quay, disabled } = this.props
    const { formatMessage } = intl

    const wheelchairAccess = getIn(quay, ['accessibilityAssessment', 'limitations', 'wheelchairAccess'], 'UNKNOWN')
    const stepFreeAccess = getIn(quay, ['accessibilityAssessment', 'limitations', 'stepFreeAccess'], 'UNKNOWN')

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <WheelChairPopover
              disabled={disabled}
              displayLabel={true}
              intl={intl}
              wheelchairAccess={wheelchairAccess}
              handleChange={this.handleWheelChairChange.bind(this)}
            />
            <ToolTipIcon title={formatMessage({id: 'wheelChair_quay_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
       <div style={{marginTop: 10}}>
         <div style={{display: 'flex',justifyContent: 'space-between'}}>
           <StepFreePopover
             disabled={disabled}
             displayLabel={true}
             intl={intl}
             stepFreeAccess={stepFreeAccess}
             handleChange={this.handleStepFreeChange.bind(this)}
           />
           <ToolTipIcon title={formatMessage({id: 'step_free_access_quay_hint'})}/>
         </div>
         <Divider style={{marginTop: 10, marginBottom: 10}}/>
       </div>
      </div>
    )
  }
}


export default connect(null)(AcessibilityQuayTab)