import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import SearchBoxDetails from '../components/SearchBoxDetails'
import QuayItem from '../components/QuayItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import RaisedButton from 'material-ui/RaisedButton'
import { MapActions,  AjaxActions } from '../actions/'
import TextField from 'material-ui/TextField'
import stopTypes from '../components/stopTypes'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { NavigationExpandMore, NavigationExpandLess } from 'material-ui/svg-icons/'

class EditStopBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      quaysExpanded: true
    }
  }

  handleAddQuay() {
    const { dispatch } = this.props
    dispatch(MapActions.addNewQuay())
  }

  handleRemoveQuay(index) {
    const { dispatch } = this.props
    dispatch(MapActions.removeQuay(index))
  }

  handleSave() {
    const { dispatch } = this.props

    if (window.location.pathname.indexOf('new_stop') > 0) {
      dispatch(AjaxActions.saveNewStop())
    } else {
      dispatch(AjaxActions.saveEditingStop())
    }
  }

  handleStopNameChange(event) {
    const { dispatch } = this.props
    dispatch(MapActions.changeStopName(event.target.value))
  }

  handleStopDescriptionChange(event) {
    const { dispatch } = this.props
    dispatch(MapActions.changeStopDescription(event.target.value))
  }

  handleStopTypeChange(event, index, value) {
    const { dispatch } = this.props
    dispatch(MapActions.changeStopType(value))
  }

  toggleQuayExpanded() {
    const { quaysExpanded } = this.state
    this.setState({
      quaysExpanded: !quaysExpanded
    })
  }

  render() {

    const { activeStopPlace, activeMarkers, dispatch } = this.props
    const { quaysExpanded } = this.state

    let selectedMarker = null

    if (activeStopPlace && activeStopPlace.length) {
      selectedMarker = activeStopPlace[0]
    }

    if (!selectedMarker) return (
      <div>
        <span style={{ margin: 20, color: "red"}}>Something went wrong!</span>
      </div>
    )

    let captionText = 'Du oppretter nå et nytt stopp'

    if (selectedMarker.markerProps.id) {
      captionText = `Redigerer ${selectedMarker.markerProps.name} (${selectedMarker.markerProps.id})`
    }

    const categoryStyle = {
      fontWeight: 600,
      marginRight: 5
    }

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const quayStyle = {
      height: 220,
      position: "relative",
      display: "block",
      marginTop: -40
    }

    const SbStyle = {
      top: 80,
      border: "1px solid #511E12",
      background: "white",
      width: 380,
      margin: 20,
      position: "absolute",
      zIndex: 2,
      padding: 10
    }

    const scrollable = {
      overflowY: "auto",
      width: "100%",
      height: 300,
      position: "relative",
      display: "block",
      zIndex: 2
    }

    const addQuayStyle = {
      position: "absolute",
      zIndex: 999,
      top: 566,
      float: "right"
    }

    const stopBoxBar = {
      float: 'right',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      top: -10,
      left: 10,
      position:'relative',
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontWeight: '0.8em'
    }

    return (

      <div style={SbStyle}>
        <div style={stopBoxBar}>{captionText}</div>
        <div style={fixedHeader}>
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            style={{width: 350}}
            value={selectedMarker.markerProps.name}
            onChange={e => typeof e.target.value === 'string' && this.handleStopNameChange(e)}
            />
            <TextField
              hintText="Beskrivelse"
              floatingLabelText="Beskrivelse"
              style={{width: 350}}
              value={selectedMarker.markerProps.description}
              onChange={e => typeof e.target.value === 'string' && this.handleStopDescriptionChange(e)}
              />
            <SelectField value={selectedMarker.markerProps.stopPlaceType}
                autoWidth={true}
                onChange={this.handleStopTypeChange.bind(this)}
                floatingLabelText="Type"
                floatingLabelFixed={true}
                style={{width: "95%"}}
                >
                { stopTypes.map( (type, index) =>
                    <MenuItem
                      key={'stopType' + index}
                      value={type.value}
                      primaryText={type.name}
                      />
                ) }
              </SelectField>
        </div>
        <div style={{fontWeight: 600, marginTop: 10}}>
          Quays ({selectedMarker.markerProps.quays.length})
          { quaysExpanded
          ? <NavigationExpandLess onClick={() => this.toggleQuayExpanded()}style={{float: "right"}}/>
          : <NavigationExpandMore onClick={() => this.toggleQuayExpanded()}style={{float: "right"}}/>
          }
        </div>
        { quaysExpanded
          ? <FloatingActionButton
              onClick={this.handleAddQuay.bind(this)}
              style={addQuayStyle}
              mini={true}>
              <ContentAdd />
            </FloatingActionButton>
          : null }
        <div style={scrollable}>
          { quaysExpanded
            ? <div style={quayStyle}>
              { selectedMarker.markerProps.quays.map( (quay,index) =>
                <QuayItem
                  key={"quay-" + index}
                  quay={quay}
                  index={index}
                  removeQuay={() => this.handleRemoveQuay(index)}
                  />
              )}
            </div>
            : null
          }
        </div>
        <div style={{border: "1px solid #efeeef"}}>
          <RaisedButton
            primary={true}
            label="Save"
            style={{float:"right", marginTop: 10, zIndex: 999}}
            onClick={this.handleSave.bind(this)}
            />
        </div>
      </div> )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeStopPlace: state.editStopReducer.activeStopPlace,
    isLoading: state.editStopReducer.activeStopIsLoading
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStopBox)
