import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import quayTypes from './quayTypes'
import { MapActions } from '../actions/'
import { connect } from 'react-redux'
import { IconButton, FontIcon, Checkbox } from 'material-ui'
import Divider from 'material-ui/Divider'
import { NavigationExpandMore, MapsMyLocation, NavigationExpandLess } from 'material-ui/svg-icons/'

class QuayItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = { hidden: !props.quay.new }
  }

  toggleHidden() {
    const { hidden } = this.state
    this.setState({hidden : !hidden})
  }

  handleNameChange = (event) => {
    const {dispatch, index} = this.props
    dispatch(MapActions.changeQuayName(index, event.target.value))
  }

  handleTypeChange = (event, index, value) => {
    const {dispatch} = this.props
    const quayIndex = this.props.index
    dispatch(MapActions.changeQuayType(quayIndex, value))
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

    const { quay, index } = this.props
    const { hidden } = this.state

    quay.quayType = quay.quayType || 'other'

    const style = {
      color: "#2196F3",
      cursor: "pointer",
      marginTop: "30px",
      display: "block",
      marginBottom: 50
    }

    const removeStyle = {
      right: 0,
      float: "right",
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
            <MapsMyLocation style={locationStyle} onClick={() => this.locateOnMap()}/>{quay.name}
            { quay.new ? <span style={{color: 'red', marginLeft: '20px'}}> - unsaved</span> : null}
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
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            value={quay.name}
            style={{width: "95%"}}
            onChange={e => typeof e.target.value === 'string' && this.handleNameChange(e)}
          />
          <TextField
            hintText="Description"
            floatingLabelText="Description"
            value={quay.description || ''}
            style={{width: "95%"}}
            onChange={e => typeof e.target.value === 'string' && this.handleDescriptionChange(e)}
          />
          <SelectField value={quay.quayType}
            autoWidth={true}
            onChange={this.handleTypeChange}
            floatingLabelText="Type"
            floatingLabelFixed={true}
            style={{width: "95%"}}
            >
            { quayTypes.map( (type, index) =>
                <MenuItem
                  key={'quayType' + index}
                  value={type.value}
                  primaryText={type.name}
                  />
            ) }
          </SelectField>
          <Checkbox
            defaultChecked={quay.allAreasWheelchairAccessible}
            label="All areas are wheelchair accessible"
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
