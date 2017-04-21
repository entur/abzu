import React from 'react'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import Divider from 'material-ui/Divider'
import ToolTipIcon from './ToolTipIcon'
import MdWc from 'material-ui/svg-icons/notification/wc'
import WaitingRoom from '../static/icons/facilities/WaitingRoom'
import BikeParking from '../static/icons/facilities/BikeParking'
import TextField from 'material-ui/TextField'
import MdMore from 'material-ui/svg-icons/navigation/more-vert'
import MdLess from 'material-ui/svg-icons/navigation/expand-less'
import FlatButton from 'material-ui/FlatButton'
import StairsIcon from '../static/icons/accessibility/Stairs'
import EnclosedIcon from '../static/icons/facilities/Enclosed'
import Heated from '../static/icons/facilities/Heated'
import equipmentHelpers from '../modelUtils/equipmentHelpers'
import { EquipmentActions } from '../actions/'
import { getIn } from '../utils/'

class FacilitiesQuayTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expandedIndex: -1
    }
  }

  handleExpandIndex(value) {
    this.setState({
      expandedIndex: value
    })
  }

  handleCollapseIndex(value) {
    this.setState({
      expandedIndex: -1
    })
  }

  handleTicketMachineChange(value) {
    const { index, disabled, dispatch } = this.props
    if (!disabled) {
      dispatch(EquipmentActions.updateTicketMachineState(value, 'quay', index))
    }
  }

  handleValueForTicketMachineChange(newValue) {
    const { quay } = this.props
    const oldValuesSet = {
      seats: getIn(quay, ['placeEquipments', 'shelterEquipment', 'seats'], 0),
      ticketMachines: newValue.numberOfMachines ? newValue.numberOfMachines > 0 : false,
      ticketOffice: newValue.numberOfMachines ? newValue.numberOfMachines > 0 : false
    }
    const newValuesSet = Object.assign({}, oldValuesSet, newValue)
    this.handleTicketMachineChange(newValuesSet)
  }

  handleBusShelterChange(value) {
    const { index, disabled, dispatch } = this.props
    if (!disabled) {
      dispatch(EquipmentActions.updateShelterEquipmentState(value, 'quay', index))
    }
  }

  handleValueForBusShelterChange(newValue) {
    const { quay } = this.props
    const oldValuesSet = {
      seats: getIn(quay, ['placeEquipments', 'shelterEquipment', 'seats'], 0),
      stepFree: getIn(quay, ['placeEquipments', 'shelterEquipment', 'stepFree'], false),
      enclosed: getIn(quay, ['placeEquipments', 'shelterEquipment', 'enclosed'], false)
    }
    const newValuesSet = Object.assign({}, oldValuesSet, newValue)
    this.handleBusShelterChange(newValuesSet)
  }

  handleWCChange(value) {
    const { index, disabled, dispatch } = this.props
    if (!disabled) {
      dispatch(EquipmentActions.updateWCState(value, 'quay', index))
    }
  }

  handleWaitingRoomChange(value) {
    const { index, disabled, dispatch } = this.props
    if (!disabled) {
      dispatch(EquipmentActions.updateWaitingRoomState(value, 'quay', index))
    }
  }

  handleValueForWaitingRoomChange(newValue) {
    const { quay } = this.props
    const oldValuesSet = {
      seats: getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'seats'], 0),
      heated: getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'heated'], false),
      stepFree: getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'stepFree'], false)
    }
    const newValuesSet = Object.assign({}, oldValuesSet, newValue)
    this.handleWaitingRoomChange(newValuesSet)
  }

  handleValuesForCycleStorage(newValue) {
    const { quay } = this.props
    const oldValuesSet = {
      numberOfSpaces: getIn(quay, ['placeEquipments', 'CycleStorageEquipment', 'numberOfSpaces'], 0),
      cycleStorageType: getIn(quay, ['placeEquipments', 'CycleStorageEquipment', 'cycleStorageType'], 'racks'),
    }
    const newValuesSet = Object.assign({}, oldValuesSet, newValue)
    this.handleCycleStorageChange(newValuesSet)
  }

  handleCycleStorageChange(value) {
    const { index, disabled, dispatch } = this.props
    if (!disabled) {
      dispatch(EquipmentActions.updateCycleStorageState(value, 'quay', index))
    }
  }


  render() {

    const { intl, disabled, quay } = this.props
    const { formatMessage } = intl
    const { expandedIndex } = this.state

    const ticketMachine = equipmentHelpers.getTicketMachineState(quay)
    const busShelter = equipmentHelpers.getShelterEquipmentState(quay)
    const bikeParking = equipmentHelpers.getCycleStorageEquipment(quay)
    const waitingRoom = equipmentHelpers.getWaitingRoomState(quay)
    const WC = equipmentHelpers.getSanitaryEquiptmentState(quay)

    const ticketMachineNumber = getIn(quay, ['placeEquipments', 'ticketingEquipment', 'numberOfMachines'], 0)
    const shelterSeats = getIn(quay, ['placeEquipments', 'shelterEquipment', 'seats'], 0)
    const shelterStepFree = getIn(quay, ['placeEquipments', 'shelterEquipment', 'stepFree'], false)
    const shelterEnclosed = getIn(quay, ['placeEquipments', 'shelterEquipment', 'enclosed'], false)
    const waitingRoomSeats = getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'seats'], 0)
    const waitingRoomHeated = getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'heated'], false)
    const waitingRoomStepFree = getIn(quay, ['placeEquipments', 'waitingRoomEquipment', 'stepFree'], false)
    const bikeParkingSpaces = getIn(quay, ['placeEquipments', 'cycleStorageEquipment', 'numberOfSpaces'], 0)

    return (
      <div style={{padding: 10}}>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={ticketMachine}
              checkedIcon={<TicketMachine />}
              uncheckedIcon={<TicketMachine style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ ticketMachine ? formatMessage({id: 'ticketMachine'}) : formatMessage({id: 'ticketMachine_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => { this.handleTicketMachineChange(v) }}
            />
            <ToolTipIcon title={formatMessage({id: 'ticketMachine_stop_hint'})}/>
          </div>
          { expandedIndex === 0
            ?
            <div>
              <TextField
                hintText={formatMessage({id: 'number_of_ticket_machines'})}
                type="number"
                value={ticketMachineNumber}
                disabled={disabled}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({id: 'number_of_ticket_machines'})}
                onChange={(event, value) => { this.handleValueForTicketMachineChange({numberOfMachines: value})}}
              />
            </div>
            : null
          }
          <div style={{textAlign: 'center', marginBottom: 5}}>
            { expandedIndex === 0
              ? <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdLess style={{height: 16, width: 16}}/>}
                onClick={() => this.handleCollapseIndex(0)}
              />
              :
              <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdMore style={{height: 16, width: 16}}/>}
                onClick={() => this.handleExpandIndex(0)}
              />
            }
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Checkbox
              checked={busShelter}
              checkedIcon={<BusShelter />}
              uncheckedIcon={<BusShelter style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ busShelter ? formatMessage({id: 'busShelter'}) : formatMessage({id: 'busShelter_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => { this.handleBusShelterChange(v) }}
            />
            <ToolTipIcon title={formatMessage({id: 'busShelter_stop_hint'})}/>
          </div>
          { expandedIndex === 1
            ?
            <div>
              <TextField
                hintText={formatMessage({id: 'number_of_seats'})}
                type="number"
                value={shelterSeats}
                onChange={(event, value) => { this.handleValueForBusShelterChange({seats: value})}}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({id: 'number_of_seats'})}
              />
              <div style={{display: 'block'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                  <Checkbox
                    checked={shelterStepFree}
                    checkedIcon={<StairsIcon />}
                    style={{width: 'auto'}}
                    label={ shelterStepFree ? formatMessage({id: 'step_free_access'}) : formatMessage({id: 'step_free_access_no'}) }
                    uncheckedIcon={<StairsIcon style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                    labelStyle={{fontSize: '0.8em'}}
                    onCheck={(e,v) => { this.handleValueForBusShelterChange({stepFree: v}) }}
                  />
                  <Checkbox
                    checked={shelterEnclosed}
                    checkedIcon={<EnclosedIcon />}
                    uncheckedIcon={<EnclosedIcon style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                    label={ shelterEnclosed ? formatMessage({id: 'enclosed'}) : formatMessage({id: 'enclosed_no'}) }
                    labelStyle={{fontSize: '0.8em'}}
                    style={{width: 'auto'}}
                    onCheck={(e,v) => { this.handleValueForBusShelterChange({enclosed: v}) }}
                  />
                </div>
              </div>
            </div>
            : null
          }
          <div style={{textAlign: 'center', marginBottom: 5}}>
            { expandedIndex === 1
              ? <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdLess style={{height: 16, width: 16}}/>}
                onClick={() => this.handleCollapseIndex(1)}
              />
              :
              <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdMore style={{height: 16, width: 16}}/>}
                onClick={() => this.handleExpandIndex(1)}
              />
            }
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={WC}
              checkedIcon={<MdWc />}
              uncheckedIcon={<MdWc style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ WC ? formatMessage({id: 'wc'}) : formatMessage({id: 'wc_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => { this.handleWCChange(v) }}
            />
            <ToolTipIcon title={formatMessage({id: 'wc_stop_hint'})}/>
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={waitingRoom}
              checkedIcon={<WaitingRoom />}
              uncheckedIcon={<WaitingRoom style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ waitingRoom ? formatMessage({id: 'waiting_room'}) : formatMessage({id: 'waiting_room_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => { this.handleWaitingRoomChange(v) }}
            />
            <ToolTipIcon title={formatMessage({id: 'waitingroom_stop_hint'})}/>
          </div>
          { expandedIndex === 3
            ?
            <div>
              <TextField
                hintText={formatMessage({id: 'number_of_seats'})}
                type="number"
                value={waitingRoomSeats}
                disabled={disabled}
                onChange={(event, value) => { this.handleValueForWaitingRoomChange({seats: value})}}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({id: 'number_of_seats'})}
              />
              <div style={{display: 'block'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                  <Checkbox
                    checked={waitingRoomStepFree}
                    checkedIcon={<StairsIcon />}
                    style={{width: 'auto'}}
                    label={ busShelter ? formatMessage({id: 'step_free_access'}) : formatMessage({id: 'step_free_access_no'}) }
                    uncheckedIcon={<StairsIcon style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                    labelStyle={{fontSize: '0.8em'}}
                    onCheck={(e,v) => { this.handleValueForWaitingRoomChange({stepFree: v}) }}
                  />
                  <Checkbox
                    checked={waitingRoomHeated}
                    checkedIcon={<Heated/>}
                    uncheckedIcon={<Heated style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
                    label={ busShelter ? formatMessage({id: 'heating'}) : formatMessage({id: 'heating_no'}) }
                    labelStyle={{fontSize: '0.8em'}}
                    style={{width: 'auto'}}
                    onCheck={(e,v) => { this.handleValueForWaitingRoomChange({heated: v}) }}
                  />
                </div>
              </div>
            </div>
            : null
          }
          <div style={{textAlign: 'center', marginBottom: 5}}>
            { expandedIndex === 3
              ? <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdLess style={{height: 16, width: 16}}/>}
                onClick={() => this.handleCollapseIndex(3)}
              />
              :
              <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdMore style={{height: 16, width: 16}}/>}
                onClick={() => this.handleExpandIndex(3)}
              />
            }
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
        <div style={{marginTop: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between'}}>
            <Checkbox
              checked={bikeParking}
              checkedIcon={<BikeParking />}
              uncheckedIcon={<BikeParking style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
              label={ bikeParking ? formatMessage({id: 'bike_parking'}) : formatMessage({id: 'bike_parking_no'}) }
              labelStyle={{fontSize: '0.8em'}}
              style={{width: '80%'}}
              onCheck={(e,v) => { this.handleCycleStorageChange(v) } }
            />
            <ToolTipIcon title={formatMessage({id: 'bike_parking_hint'})}/>
          </div>
          { expandedIndex === 4
            ?
            <div>
              <TextField
                hintText={formatMessage({id: 'number_of_spaces'})}
                type="number"
                value={bikeParkingSpaces}
                disabled={disabled}
                onChange={(event, value) => { this.handleValuesForCycleStorage({numberOfSpaces: value})}}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({id: 'number_of_spaces'})}
              />
            </div>
            : null
          }
          <div style={{textAlign: 'center', marginBottom: 5}}>
            { expandedIndex === 4
              ? <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdLess style={{height: 16, width: 16}}/>}
                onClick={() => this.handleCollapseIndex(4)}
              />
              :
              <FlatButton
                style={{height: 20, minWidth: 20, width: 20}}
                icon={<MdMore style={{height: 16, width: 16}}/>}
                onClick={() => this.handleExpandIndex(4)}
              />
            }
          </div>
          <Divider style={{marginTop: 10, marginBottom: 0}}/>
        </div>
      </div>
    )
  }
}

export default connect(null)(FacilitiesQuayTab)