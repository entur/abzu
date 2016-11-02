import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { MapActions } from '../actions/'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Divider from 'material-ui/Divider'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'


class QuayItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = { hidden: !props.quay.new }
  }

  toggleHidden() {
    const { hidden } = this.state
    this.setState({hidden : !hidden})
  }

  handleNameChange = (event, textPadding) => {
    const {dispatch, index} = this.props
    let newName = event.target.value.replace(textPadding, '')
    if (event.target.value.length < textPadding.length) {
      newName = ''
    }

    dispatch(MapActions.changeQuayName(index, newName))
  }

  handleDescriptionChange = (event) => {
    const {dispatch, index} = this.props
    dispatch(MapActions.changeQuayDescription(index, event.target.value))
  }

  handleWHAChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeWHA(index, event.target.checked))
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

    const { quay, index, translations } = this.props
    const { hidden } = this.state

    const style = {
      color: "#2196F3",
      cursor: "pointer",
      marginTop: 30,
      display: "block",
      marginBottom: 50
    }

    const removeStyle = {
      width: '100%',
      textAlign: 'right',
      paddingBottom: 20
    }

    const locationStyle = {
      marginRight: 5,
      verticalAlign: 'text-top',
      height: 16,
      width: 16
    }

    return (

      <div>
        <div style={style}>
          <div style={{float: "left", width: "95%", marginTop: 20, padding: 5}}>
            <MapsMyLocation style={locationStyle} onClick={() => this.locateOnMap()}/>
            <div style={{display: 'inline-block'}} onClick={() => this.toggleHidden()}>
              {`${translations.quayItemName ? translations.quayItemName : ''} ${quay.name} (${quay.id || '?'})`}
            </div>
            { quay.new ? <span style={{color: 'red', marginLeft: '20px'}}>{" - " + translations.unsaved}</span> : null}
            { hidden
              ? <NavigationExpandMore
                  onClick={() => this.toggleHidden()}
                  style={{float: "right"}}
                />
              : <NavigationExpandLess
                  onClick={() => this.toggleHidden()}
                  style={{float: "right"}}
                />
             }
          </div>
        </div>
       { hidden ? null
       : <div>
          {
          translations.quayItemName
          ?
          <TextField
            hintText={translations.quayItemName}
            floatingLabelText={translations.quayItemName}
            value={translations.quayItemName + ' ' + quay.name}
            style={{width: "95%"}}
            onChange={e => typeof e.target.value === 'string' && this.handleNameChange(e, translations.quayItemName + ' ')}
          />
          : null
          }
          <TextField
            hintText={translations.description}
            floatingLabelText={translations.description}
            value={quay.description || ''}
            style={{width: "95%"}}
            onChange={e => typeof e.target.value === 'string' && this.handleDescriptionChange(e)}
          />
          <Checkbox
            defaultChecked={quay.allAreasWheelchairAccessible}
            label={translations.allAreasWheelchairAccessible}
            onCheck={this.handleWHAChange}
            style={{marginBottom: "10px", width: "95%", marginTop: "10px"}}
            />
          <IconButton
            iconClassName="material-icons"
            onClick={this.props.removeQuay}
            style={removeStyle}
          >
          delete
          </IconButton>
          <Divider
            style={{marginBottom: 10}}
            inset={true}
            />
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
