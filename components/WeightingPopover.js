import React from 'react'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import MenuItem from 'material-ui/MenuItem'
import MdTransfer from 'material-ui/svg-icons/maps/transfer-within-a-station'
import weightTypes, { weightColors } from '../models/weightTypes'

class WeightingPopover extends React.Component {

  render() {

    const { handleClose, handleChange, open, anchorEl, locale } = this.props

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={handleClose}
        animation={PopoverAnimationVertical}
      >
        { weightTypes[locale].map( (type, index) => (
          <MenuItem
            key={'weightType' + index}
            value={type.value}
            style={{padding: '0px 10px'}}
            primaryText={type.name}
            onClick={() => { handleChange(type.value) }}
            leftIcon={<MdTransfer color={weightColors[type.value] || 'grey' }/>}
          />
        )) }
      </Popover>
    )
  }
}

export default WeightingPopover