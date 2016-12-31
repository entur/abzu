import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import { MapActions } from '../actions/'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'

class QuayItem extends React.Component {

  static PropTypes = {
    name: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    quay: PropTypes.object.isRequired,
    handleRemoveQuay: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { collapsed: !props.quay.new }
  }

  toggleCollapsed() {
    const { collapsed } = this.state
    this.setState({collapsed : !collapsed})
  }

  handleDescriptionChange = (event) => {
    const {dispatch, index} = this.props
    dispatch(MapActions.changeQuayDescription(index, event.target.value))
  }

  handleWHAChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeWHA(index, event.target.checked))
  }

  handleNameChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeQuayName(index, event.target.value))
  }

  handleSetFocus = () => {
    const { dispatch, index } = this.props
    dispatch(MapActions.setQuayFocus(index))
  }

  locateOnMap = () => {
    const { dispatch, quay } = this.props
    const position = {
      lat: quay.centroid.location.latitude,
      lng: quay.centroid.location.longitude
    }
    dispatch(MapActions.changeMapCenter(position, 7))
  }

  render() {

    const { quay, translations, name } = this.props
    const { collapsed } = this.state

    const removeStyle = {
      float: 'right',
      paddingBottom: 0
    }

    const locationStyle = {
      marginRight: 5,
      verticalAlign: 'text-top',
      height: 16,
      width: 16
    }

    const quayTitlePrefix = `${translations.quayItemName ? translations.quayItemName : ''} `
    const quayTitleSuffix = `${(name && name.length) ? name : ` - ${translations.undefined}`}, (ID: ${quay.id||'?'})`

    return (

      <div>
        <div className="tabItem">
          <div style={{float: "left", width: "95%", marginTop: 20, padding: 5}}>
            <MapsMyLocation style={locationStyle} onClick={() => this.locateOnMap()}/>
            <div style={{display: 'inline-block'}} onClick={() => this.toggleCollapsed()}>
              {quayTitlePrefix + quayTitleSuffix}
            </div>
            { quay.new ? <span style={{color: 'red', marginLeft: '20px'}}>{" - " + translations.unsaved}</span> : null}
            { collapsed
              ? <NavigationExpandMore
                  onClick={() => this.toggleCollapsed()}
                  style={{float: "right"}}
                />
              : <NavigationExpandLess
                  onClick={() => this.toggleCollapsed()}
                  style={{float: "right"}}
                />
             }
          </div>
        </div>
       { collapsed ? null
       : <div>
           <TextField
             hintText={translations.name}
             floatingLabelText={translations.name}
             value={quay.name || ''}
             style={{width: "95%", marginTop: -10}}
             onChange={e => typeof e.target.value === 'string' && this.handleNameChange(e)}
             onFocus={() => this.handleSetFocus()}
           />
          <TextField
            hintText={translations.description}
            floatingLabelText={translations.description}
            value={quay.description || ''}
            style={{width: "95%", marginTop: -10}}
            onChange={e => typeof e.target.value === 'string' && this.handleDescriptionChange(e)}
            onFocus={() => this.handleSetFocus()}
          />
          <Checkbox
            defaultChecked={quay.allAreasWheelchairAccessible}
            label={translations.allAreasWheelchairAccessible}
            onCheck={this.handleWHAChange}
            style={{marginBottom: "10px", width: "95%", marginTop: "10px"}}
            />
          <IconButton
            iconClassName="material-icons"
            onClick={this.props.handleRemoveQuay}
            style={removeStyle}
          >
          delete
          </IconButton>
        </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  null,
  mapDispatchToProps
)(QuayItem)
