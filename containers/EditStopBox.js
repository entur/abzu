import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
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

class EditStopBox extends React.Component {

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

  render() {

    const { activeStopPlace, activeMarkers, dispatch } = this.props

    let selectedMarker = null

    if (activeStopPlace && activeStopPlace.length) {
      selectedMarker = activeStopPlace[0]
    }

    if (!selectedMarker) return (
      <div>
        <span style={{ margin: "20px", color: "red"}}>Something went wrong!</span>
      </div>
    )

    const categoryStyle = {
      fontWeight: "600",
      marginRight: "5px"
    }

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const quayStyle = {
      height: "500px",
      position: "relative",
      display: "block"
    }

    const SbStyle = {
      top: "80px",
      background: "white",
      width: "380px",
      margin: "20px",
      position: "absolute",
      zIndex: "2",
      padding: "10px"
    }

    const scrollable = {
      overflowY: "auto",
      width: "100%",
      height: "400px",
      position: "relative",
      display: "block",
      zIndex: "2"
    }

    const addQuayStyle = {
      position: "relative",
      top: "-5px",
      float: "right"
    }

    return (

      <div style={SbStyle}>
        <div style={fixedHeader}>
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            style={{width: "350px", marginTop: "10px"}}
            value={selectedMarker.markerProps.name}
            onChange={e => typeof e.target.value === 'string' && this.handleStopNameChange(e)}
            />
            <TextField
              hintText="Beskrivelse"
              floatingLabelText="Beskrivelse"
              style={{width: "350px"}}
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
          <div style={{marginBottom: "10px"}}>
            <FloatingActionButton
              onClick={this.handleAddQuay.bind(this)}
              style={addQuayStyle}
              mini={true}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
        </div>
        <span style={{fontWeight: "600"}}>Quays ({selectedMarker.markerProps.quays.length})</span>
        <div style={scrollable}>
          <div style={quayStyle}>
            { selectedMarker.markerProps.quays.map( (quay,index) =>
              <QuayItem
                key={"quay-" + index}
                quay={quay}
                index={index}
                removeQuay={() => this.handleRemoveQuay(index)}
                />
            )}
          </div>
        </div>
        <RaisedButton
          primary={true}
          label="Save"
          style={{float:"right", marginTop: "6px", zIndex: "999"}}
          onClick={this.handleSave.bind(this)}
          />
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
