import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import SearchBoxDetails from '../components/SearchBoxDetails'
import QuayItem from '../components/QuayItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FlatButton from 'material-ui/FlatButton'
import { MapActions,  AjaxActions } from '../actions/'

class EditStopBox extends React.Component {

  handleAddQuay() {
    const {dispatch} = this.props
    dispatch(MapActions.addNewQuay())
  }

  handleRemoveQuay(index) {
    const {dispatch} = this.props
    dispatch(MapActions.removeQuay(index))
  }

  handleSave() {
    const {dispatch} = this.props
    dispatch(AjaxActions.saveEditingStop())
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
      position: "absolute",
      width: "95%",
      margin: "auto"
    }

    const quayStyle = {
      border: "1px solid #e5e5e5",
      padding: "20px",
      overflow: "scroll",
      height: "500px"
    }

    const SbStyle = {
      top: "100px",
      background: "white",
      height: "auto",
      width: "380px",
      margin: "20px",
      position: "absolute",
      zIndex: "2",
      padding: "10px"
    }

    const scrollable = {
      overflow: "auto",
      height: "550px",
      zIndex: "2"
    }

    const addQuayStyle = {
      display:"inline-block",
      float: "right"
    }

    return (

      <div style={SbStyle}>
        <div style={fixedHeader}>
            {selectedMarker.text}
            <FlatButton
              onClick={this.handleSave.bind(this)}
              label="Save"
              style={{float:"right"}}
              />
        </div>
        <div style={{scrollable}}>
          <p>
            {selectedMarker.description}
          </p>
          <p style={{marginTop: "30px"}}>
            <span style={categoryStyle}>Type:</span>
            { selectedMarker.type || 'Not specified' }
          </p>

          { selectedMarker.markerProps
            ?
            <div style={quayStyle}>
              <div style={{marginBottom: "40px"}}>
                <span style={{fontWeight: "600"}}>Quays</span>
                <FloatingActionButton
                  onClick={this.handleAddQuay.bind(this)}
                  style={addQuayStyle}
                  mini={true}>
                  <ContentAdd />
                </FloatingActionButton>
              </div>
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
