import React from 'react'
import ModalityIcon from '../components/ModalityIcon'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'
import ImportedId from '../components/ImportedId'
import { StopPlaceActions, AssessmentActions, EquipmentActions } from '../actions/'
import { connect } from 'react-redux'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import debounce from 'lodash.debounce'
import Checkbox from 'material-ui/Checkbox'
import stopTypes from './stopTypes'
import MdWC from 'material-ui/svg-icons/notification/wc'
import WaitingRoom from '../static/icons/facilities/WaitingRoom'
import BikeParking from '../static/icons/facilities/BikeParking'
import WheelChairPopover from './WheelChairPopover'
import { getIn } from '../utils'
import equiptmentHelpers from '../modelUtils/equipmentHelpers'
import MdLanguage from 'material-ui/svg-icons/action/language'
import { enturPrimary } from '../config/enturTheme'
import AltNamesDialog from './AltNamesDialog'

class StopPlaceDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stopTypeOpen: false,
      name: props.stopPlace.name || '',
      description: props.stopPlace.description || '',
      altNamesDialogOpen: false
    }

    this.updateStopName = debounce( value => {
      this.props.dispatch(StopPlaceActions.changeStopName(value))
    }, 200)

    this.updateStopDescription = debounce( value => {
      this.props.dispatch(StopPlaceActions.changeStopDescription(value))
    }, 200)
  }

  componentWillReceiveProps(props) {
    this.setState({
      description: props.stopPlace.description || '',
      name: props.stopPlace.name || '',
    })
  }

  handleCloseStopPlaceTypePopover() {
    this.setState({
      stopTypeOpen: false
    })
  }

  handleOpenStopPlaceTypePopover(event) {
    this.setState({
      stopTypeOpen: true,
      wheelChairOpen: false,
      stopTypeAnchorEl: event.currentTarget
    })
  }

 handleStopNameChange(event) {
    const name = event.target.value
    this.setState({
      name: name
    })

    this.updateStopName(name)
  }

  handleStopDescriptionChange(event) {
    const description = event.target.value
    this.setState({
      description: description
    })

    this.updateStopDescription(description)
  }

  handleHandleWheelChair(value) {
    if (!this.props.disabled)
      this.props.dispatch(AssessmentActions.setStopWheelchairAccess(value))
  }

  handleStopTypeChange(value) {
    this.handleCloseStopPlaceTypePopover()
    this.props.dispatch(StopPlaceActions.changeStopType(value))
  }

  handleTicketMachineChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(EquipmentActions.updateTicketMachineState(value, 'stopPlace', this.props.stopPlace.id))
    }
  }

  handleBusShelterChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(EquipmentActions.updateShelterEquipmentState(value, 'stopPlace', this.props.stopPlace.id))
    }
  }

  handleWCChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(EquipmentActions.updateWCState(value, 'stopPlace', this.props.stopPlace.id))
    }
  }

  handleWaitingRoomChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(EquipmentActions.updateWaitingRoomState(value, 'stopPlace', this.props.stopPlace.id))
    }
  }

  handleCycleStorageChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(EquipmentActions.updateCycleStorageState(value, 'stopPlace', this.props.stopPlace.id))
    }
  }


  render() {

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const { stopPlace, intl, expanded, disabled } = this.props
    const { formatMessage, locale } = intl
    const { name, description, altNamesDialogOpen } = this.state

    const wheelchairAccess = getIn(stopPlace, ['accessibilityAssessment', 'limitations', 'wheelchairAccess'], 'UNKNOWN')

    const ticketMachine = equiptmentHelpers.getTicketMachineState(stopPlace)
    const busShelter = equiptmentHelpers.getShelterEquipmentState(stopPlace)
    const bikeParking = equiptmentHelpers.getCycleStorageEquipment(stopPlace)
    const waitingRoom = equiptmentHelpers.getWaitingRoomState(stopPlace)
    const WC = equiptmentHelpers.getSanitaryEquiptmentState(stopPlace)

    const hasAltNames = !!(stopPlace.alternativeNames && stopPlace.alternativeNames.length)

    return (
      <div style={fixedHeader}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{flex: 1}}>
            <ImportedId id={stopPlace.importedId} text={formatMessage({id: 'local_reference'})}/>
          </div>
          <IconButton
            disabled={disabled}
            style={{borderBottom: '1px dotted grey'}}
            onClick={(e) => { this.handleOpenStopPlaceTypePopover(e) }}
          >
            <ModalityIcon
              type={ stopPlace.stopPlaceType }
            />
          </IconButton>
          <Popover
            open={this.state.stopTypeOpen}
            anchorEl={this.state.stopTypeAnchorEl}
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
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <TextField
            hintText={formatMessage({id: 'name'})}
            floatingLabelText={formatMessage({id: 'name'})}
            style={{marginTop: -10, width: 340}}
            value={name}
            disabled={disabled}
            onChange={this.handleStopNameChange.bind(this)}
          />
          <div style={{marginLeft: 6, borderBottom: '1px dotted', marginTop: -3}}>
            <IconButton
              onClick={ () => { this.setState({altNamesDialogOpen: true}) }}
            >
              <MdLanguage color={hasAltNames ? enturPrimary : '#000'}/>
            </IconButton>
          </div>
        </div>
        <TextField
          hintText={formatMessage({id: 'description'})}
          floatingLabelText={formatMessage({id: 'description'})}
          style={{width: 340, marginTop: -10}}
          disabled={disabled}
          value={description}
          onChange={this.handleStopDescriptionChange.bind(this)}
        />
        { expanded
          ? null
          : <div style={{marginTop: 10, marginBottom: 10, height: 15, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <WheelChairPopover
                intl={intl}
                handleChange={this.handleHandleWheelChair.bind(this)}
                wheelchairAccess={wheelchairAccess}
              />
              <Checkbox
                checkedIcon={<TicketMachine />}
                uncheckedIcon={<TicketMachine style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                style={{width: 'auto'}}
                checked={ticketMachine}
                onCheck={(e,v) => { this.handleTicketMachineChange(v) } }
              />
              <Checkbox
                checkedIcon={<BusShelter />}
                uncheckedIcon={<BusShelter style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                style={{width: 'auto'}}
                checked={busShelter}
                onCheck={(e,v) => { this.handleBusShelterChange(v) } }
              />
              <Checkbox
                checkedIcon={<MdWC />}
                uncheckedIcon={<MdWC style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                style={{width: 'auto'}}
                checked={WC}
                onCheck={(e,v) => { this.handleWCChange(v) } }
              />
            <Checkbox
              checkedIcon={<WaitingRoom />}
              uncheckedIcon={<WaitingRoom style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              style={{width: 'auto'}}
              checked={waitingRoom}
              onCheck={(e,v) => { this.handleWaitingRoomChange(v) } }
            />
              <Checkbox
                checkedIcon={<BikeParking />}
                uncheckedIcon={<BikeParking style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                style={{width: 'auto'}}
                checked={bikeParking}
                onCheck={(e,v) => { this.handleCycleStorageChange(v) } }
              />
          </div>
        }
        <AltNamesDialog
          open={altNamesDialogOpen}
          altNames={stopPlace.alternativeNames}
          intl={intl}
          disabled={disabled}
          handleClose={ () => { this.setState({altNamesDialogOpen: false}) }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current
})

export default connect(mapStateToProps)(StopPlaceDetails)