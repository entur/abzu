import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import accessibilityAssessments from './accessibilityAssessments'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import StairsIcon from '../static/icons/accessibility/Stairs'
import IconButton from 'material-ui/IconButton'

class StepFreePopover extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      anchorEl: null,
    }
  }

  handleChange(value) {
    this.setState({
      open: false
    })
    this.props.handleChange(value)
  }

  handleOpenPopover(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleClosePopover() {
    this.setState({
      open: false
    })
  }

  render() {

    const { intl, displayLabel, stepFreeAccess, disabled } = this.props
    const { locale } = intl
    const { open, anchorEl } = this.state

    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', fontSize: '0.8em'}}>
          <IconButton
            style={{borderBottom: disabled ? 'none' : '1px dotted grey'}}
            onClick={(e) => { if (!disabled) this.handleOpenPopover(e) }}
          >
            <StairsIcon color={accessibilityAssessments.colors[stepFreeAccess]}/>
          </IconButton>
          { displayLabel ? <div style={{maginLeft: 5}}>
              { accessibilityAssessments.stepFreeAccess.values[locale][stepFreeAccess] }
            </div> : ''}
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleClosePopover.bind(this)}
          animation={PopoverAnimationVertical}
        >
          { accessibilityAssessments.stepFreeAccess.options.map( (option, index) =>
            <MenuItem
              key={'wheelChairItem' + index}
              value={option}
              style={{padding: '0px 10px'}}
              onClick={() => { this.handleChange(option) }}
              primaryText={accessibilityAssessments.stepFreeAccess.values[locale][option]}
              secondaryText={(
                <StairsIcon
                  style={{float: 'left', marginLeft: -18, marginTop: 9, marginRight: 5, color: accessibilityAssessments.colors[option]}}
                />)}
            />
          ) }
        </Popover>
      </div>
    )
  }
}

export default StepFreePopover