import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import { MapActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'
import WheelChairOff from 'material-ui/svg-icons/action/accessibility'
import WheelChair from 'material-ui/svg-icons/action/accessible'
import Stairs from '../static/icons/accessibility/Stairs'
import StepFree from '../static/icons/accessibility/StepFree'
import TicketMachine from '../static/icons/facilities/TicketMachine'
import BusShelter from '../static/icons/facilities/BusShelter'
import MdMore from 'material-ui/svg-icons/navigation/more-horiz'
import { injectIntl } from 'react-intl'
import FlatButton from 'material-ui/FlatButton'
import stopTypes from './stopTypes'
import Divider from 'material-ui/Divider'
import MdError from 'material-ui/svg-icons/alert/error'

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
      wheelchairAccess: formatMessage({id: 'wheelchairAccess'}),
      ticketMachine: formatMessage({id: 'ticketMachine'}),
      busShelter: formatMessage({id: 'busShelter'}),
      quayItemName: formatMessage({id: quayItemName || 'name'}),
      quayMissingLocation: formatMessage({id: 'quay_is_missing_location'})
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
          <div style={{float: "flex", alignItems: 'center', width: "95%", marginTop: 20, padding: 5}}>
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
            { quay.new ? <span style={{color: 'red', marginLeft: '20px'}}>{" - " + translations.unsaved}</span> : null}
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

           <div style={{marginTop: 10, marginBottom: 15, display: 'flex', justifyContent: 'space-between'}}>
             <Checkbox
               checkedIcon={<WheelChair />}
               uncheckedIcon={<WheelChairOff />}
               label={translations.wheelchairAccess}
               labelStyle={{fontSize: '0.8em'}}
               style={{width: '45%'}}
             />
             <Checkbox
               checkedIcon={<StepFree />}
               uncheckedIcon={<Stairs />}
               label={translations.stepFreeAccess}
               labelStyle={{fontSize: '0.8em'}}
               style={{width: '45%'}}
             />
           </div>
           <div style={{marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
             <Checkbox
               checkedIcon={<TicketMachine />}
               uncheckedIcon={<TicketMachine />}
               label={translations.ticketMachine}
               labelStyle={{fontSize: '0.8em'}}
               style={{width: '45%'}}
             />
             <Checkbox
               checkedIcon={<BusShelter />}
               uncheckedIcon={<BusShelter />}
               label={translations.busShelter}
               labelStyle={{fontSize: '0.8em'}}
               style={{width: '45%'}}
             />
           </div>
           <div>
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
