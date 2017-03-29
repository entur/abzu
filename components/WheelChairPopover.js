import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import accessibilityAssessments from './accessibilityAssessments'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import WheelChair from 'material-ui/svg-icons/action/accessible'
import IconButton from 'material-ui/IconButton'


class WheelChairPopover extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      anchorEl: null,
      wheelChairFriendly: 'UNKNOWN',
    }
  }

  handleChange(value) {
    this.setState({
      wheelChairFriendly: value,
      open: false
    })
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

    const { intl, displayLabel } = this.props
    const { locale } = intl
    const { open, anchorEl, wheelChairFriendly } = this.state

    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', fontSize: '0.8em'}}>
          <IconButton
            style={{borderBottom: '1px dotted grey'}}
            onClick={(e) => { this.handleOpenPopover(e) }}
          >
            <WheelChair color={accessibilityAssessments.colors[wheelChairFriendly]}/>
          </IconButton>
          { displayLabel ? <div style={{maginLeft: 5}}>
              { accessibilityAssessments.wheelchairAccess.values[locale][wheelChairFriendly] }
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
          { Object.entries(accessibilityAssessments.wheelchairAccess.values[locale]).map( (entry, index) =>
            <MenuItem
              key={'wheelChairItem' + index}
              value={entry[0]}
              style={{padding: '0px 10px'}}
              onClick={() => { this.handleChange(entry[0]) }}
              primaryText={entry[1]}
              secondaryText={(
                <WheelChair
                  style={{float: 'left', marginLeft: -18, marginTop: 9, marginRight: 5, color: accessibilityAssessments.colors[entry[0]]}}
                />)}
            />
          ) }
        </Popover>
      </div>
    )
  }
}

export default WheelChairPopover