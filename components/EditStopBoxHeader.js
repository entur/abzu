import React from 'react'
import ModalityIcon from '../components/ModalityIcon'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'
import stopTypes from './stopTypes'
import { MapActions } from '../actions/'

class EditstopBoxHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stopTypeOpen: false,
    }
  }

  handleCloseStopPlaceTypePopover() {
    this.setState({
      stopTypeOpen: false
    })
  }

  handleOpenStopPlaceTypePopover(event) {
    this.setState({
      stopTypeOpen: true,
      anchorEl: event.currentTarget
    })
  }

  handleStopNameChange(event) {
    this.props.dispatch(MapActions.changeStopName(event.target.value))
  }

  handleStopDescriptionChange(event) {
    this.props.dispatch(MapActions.changeStopDescription(event.target.value))
  }

  handleStopTypeChange(value) {
    this.handleCloseStopPlaceTypePopover()
    this.props.dispatch(MapActions.changeStopType(value))
  }

  render() {

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const { activeStopPlace, intl } = this.props
    const { formatMessage, locale } = intl

    return (
      <div style={fixedHeader}>
        <TextField
          hintText={formatMessage({id: 'name'})}
          floatingLabelText={formatMessage({id: 'name'})}
          style={{width: 350, marginTop: -20}}
          value={activeStopPlace.name}
          onChange={e => { this.handleStopNameChange(e) }}
        />
        <IconButton
          style={{float: 'right'}}
          onClick={(e) => { this.handleOpenStopPlaceTypePopover(e) }}
        >
          <ModalityIcon
            type={ activeStopPlace.stopPlaceType }
          />
        </IconButton>
        <Popover
          open={this.state.stopTypeOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleCloseStopPlaceTypePopover.bind(this)}
          animation={PopoverAnimationVertical}
        >
          { stopTypes[locale].map( (type, index) =>
            <MenuItem
              key={'stopType' + index}
              value={type.value}
              style={{padding: '0px 10px'}}
              primaryText={type.name}
              onClick={() => { this.handleStopTypeChange(type.value) }}
              secondaryText={(
                <ModalityIcon
                  iconStyle={{float: 'left', marginLeft: -18, marginTop: 9}}
                  type={type.value}
                />)}
            />
          ) }
        </Popover>
        <TextField
          hintText={formatMessage({id: 'description'})}
          floatingLabelText={formatMessage({id: 'description'})}
          style={{width: 350, marginTop: -20}}
          value={activeStopPlace.description}
          onChange={e => typeof e.target.value === 'string' && this.handleStopDescriptionChange(e)}
        />
      </div>
    )
  }
}

export default EditstopBoxHeader