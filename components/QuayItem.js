import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import { MapActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'
import WheelChair from 'material-ui/svg-icons/action/accessible'
import Stairs from '../static/icons/accessibility/Stairs'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import MdMore from 'material-ui/svg-icons/navigation/more-horiz'
import { injectIntl } from 'react-intl'
import FlatButton from 'material-ui/FlatButton'
import stopTypes from './stopTypes'
import Divider from 'material-ui/Divider'
import MdError from 'material-ui/svg-icons/alert/error'
import ImportedId from './ImportedId'

class QuayItem extends React.Component {

  static PropTypes = {
    publicCode: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    quay: PropTypes.object.isRequired,
    handleRemoveQuay: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
    handleToggleCollapse: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      wheelChairFriendly: false,
      stepFreeAccess: true,
      ticketMachine: false,
      busShelter: false
    }
  }


  handleDescriptionChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeElementDescription(index, event.target.value, 'quay'))
  }

  handleNameChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeElementName(index, event.target.value, 'quay'))
  }

  showMoreOptionsForQuay = () => {
    this.props.dispatch(UserActions.showEditQuayAdditional())
  }

  render() {

    const { quay, publicCode, expanded, index, handleToggleCollapse, intl, stopPlaceType } = this.props
    const { formatMessage, locale } = intl
    const { wheelChairFriendly, stepFreeAccess, ticketMachine, busShelter } = this.state

    let quayItemName = null

    stopTypes[locale].forEach(  stopType => {
      if (stopType.value === stopPlaceType) {
        quayItemName = stopType.quayItemName
      }
    })

    const translations = {
      name: formatMessage({id: 'name'}),
      publicCode: formatMessage({id: 'publicCode'}),
      description: formatMessage({id: 'description'}),
      unsaved: formatMessage({id: 'unsaved'}),
      undefined: formatMessage({id: 'undefined'}),
      none: formatMessage({id: 'none_no'}),
      quays: formatMessage({id: 'quays'}),
      pathJunctions: formatMessage({id: 'pathJunctions'}),
      entrances: formatMessage({id: 'entrances'}),
      stepFreeAccess: formatMessage({id: 'step_free_access'}),
      noStepFreeAccess: formatMessage({id: 'step_free_access_no'}),
      wheelchairAccess: formatMessage({id: 'wheelchairAccess'}),
      noWheelchairAccess: formatMessage({id: 'wheelchairAccess_no'}),
      ticketMachine: formatMessage({id: 'ticketMachine'}),
      noTicketMachine: formatMessage({id: 'ticketMachine_no'}),
      busShelter: formatMessage({id: 'busShelter'}),
      noBusShelter: formatMessage({id: 'busShelter_no'}),
      quayItemName: formatMessage({id: quayItemName || 'name'}),
      quayMissingLocation: formatMessage({id: 'quay_is_missing_location'}),
      localReference: formatMessage({id: 'local_reference'})
    }


    const removeStyle = {
      float: 'right',
      paddingBottom: 0
    }

    const locationStyle = {
      marginRight: 5,
      height: 16,
      width: 16,
    }

    const quayTitlePrefix = `${translations.quayItemName ? translations.quayItemName : ''} `
    const quayTitleSuffix = `${publicCode || ''}`
    const idTitle = `ID: ${quay.id||'?'}`

    return (

      <div>
        <div className="tabItem">
          <div style={{float: "flex", alignItems: 'center', width: "95%", marginTop: 10, padding: 5}}>
            {  quay.location
               ? <MapsMyLocation style={locationStyle} onClick={() => this.props.handleLocateOnMap(quay.location)}/>
              :  <div className="tooltip" style={{display: 'inline-block'}}>
                   <span className="tooltipText"> { translations.quayMissingLocation }</span>
                   <MdError style={{ ...locationStyle, color: '#bb271c'}}/>
                 </div>
            }
            <div style={{display: 'inline-block', verticalAlign: 'middle'}} onClick={() => handleToggleCollapse(index, 'quay')}>
              <span style={{color: '#2196F3'}}>
                { quayTitlePrefix + quayTitleSuffix }
              </span>
              <span style={{fontSize: '0.8em', marginLeft: 5, fontWeight: 600, color: '#464545'}}> { idTitle } </span>
            </div>
            { !expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'quay')}
                  style={{float: "right"}}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'quay')}
                  style={{float: "right"}}
                />
             }
          </div>
        </div>
       { !expanded ? null
       : <div>
           <ImportedId text={translations.localReference} id={quay.importedId} />
           <TextField
             hintText={translations.publicCode}
             floatingLabelText={translations.publicCode}
             defaultValue={quay.publicCode}
             style={{width: "95%", marginTop: -10}}
             onChange={e => typeof e.target.value === 'string' && this.handleNameChange(e)}
           />
          <TextField
            hintText={translations.description}
            floatingLabelText={translations.description}
            defaultValue={quay.description}
            style={{width: "95%", marginTop: -10}}
            onChange={e => typeof e.target.value === 'string' && this.handleDescriptionChange(e)}
          />
           { false ? <IconButton
             iconClassName="material-icons"
             onClick={this.props.handleRemoveQuay}
             style={removeStyle}
             >
             delete
             </IconButton>
            : null // hide this for now, not used
           }
           <div style={{marginTop: 10, marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
             <Checkbox
               checkedIcon={<WheelChair />}
               uncheckedIcon={<WheelChair style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
               style={{width: 'auto'}}
               checked={wheelChairFriendly}
               onCheck={(e,v) => this.setState({wheelChairFriendly: v})}
             />
             <Checkbox
               checkedIcon={<Stairs />}
               uncheckedIcon={<Stairs style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
               style={{width: 'auto'}}
               checked={stepFreeAccess}
               onCheck={(e,v) => this.setState({stepFreeAccess: v})}
             />
             <Checkbox
               checkedIcon={<TicketMachine />}
               uncheckedIcon={<TicketMachine style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
               style={{width: 'auto'}}
               checked={ticketMachine}
               onCheck={(e,v) => this.setState({ticketMachine: v})}
             />
             <Checkbox
               checkedIcon={<BusShelter />}
               uncheckedIcon={<BusShelter style={{fill: '#8c8c8c', opacity: '0.8'}}  />}
               style={{width: 'auto'}}
               checked={busShelter}
               onCheck={(e,v) => this.setState({busShelter: v})}
             />
             <FlatButton icon={<MdMore/>} onClick={this.showMoreOptionsForQuay.bind(this)} />
           </div>
        </div>
        }
        <Divider inset={true} style={{marginTop: 2}}/>
      </div>
    )
  }
}

export default injectIntl(connect(null)(QuayItem))
