import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import dataSource from '../config/restMock.js'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { MapActionCreator, AjaxCreator } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import QuayItem from '../components/QuayItem'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FlatButton from 'material-ui/FlatButton'

class EditStopBox extends React.Component {

  handleAddQuay() {
    const {dispatch} = this.props
    dispatch(MapActionCreator.addNewQuay())
  }

  handleRemoveQuay(index) {
    const {dispatch} = this.props
    dispatch(MapActionCreator.removeQuay(index))
  }

  handleSave() {
    const {dispatch} = this.props
    dispatch(AjaxCreator.saveEditingStop())
  }

  render() {

    const { activeStopPlace, isLoading, activeMarkers } = this.props

    const loadingStyle = {
      top: "200px",
      height: "auto",
      width: "380px",
      margin: "20px",
      position: "absolute",
      zIndex: "2",
      padding: "10px"
    }

    if (isLoading) {
      return <div style={loadingStyle}>
        <RefreshIndicator
          size={50}
          left={70}
          top={0}
          status="loading"
          />
      </div>
    }

    let selectedMarker = null

    if (activeStopPlace && activeStopPlace.length) {
      selectedMarker = activeStopPlace[0]
    }

    const categoryStyle = {
      fontWeight: "600",
      marginRight: "2%"
    }

    const quayStyle = {
      border: "1px solid #e5e5e5",
      padding: "10px"
    }

    const SbStyle = {
      top: "200px",
      background: "white",
      height: "auto",
      width: "380px",
      margin: "20px",
      position: "absolute",
      zIndex: "2",
      padding: "10px"
    }

    const addQuayStyle = {
      display:"inline-block",
      float: "right"
    }

    return (
      <div style={SbStyle}>
        <div>
          <span style={categoryStyle}>
            Stoppested:
          </span>
          {selectedMarker.text}
        </div>
        <p>
          {selectedMarker.description}
        </p>
        <p>
          <span style={categoryStyle}>Type:</span> {selectedMarker.type || 'Not specified'}
        </p>
        <FlatButton onClick={this.handleSave.bind(this)} label="Save" style={{float:"right", marginTop: "-60px"}} />

      { selectedMarker.markerProps
        ?
        <div style={quayStyle}>
          <div style={{marginBottom: "40px"}}>
            <span style={{fontWeight: "600"}}>Quays</span>
              <FloatingActionButton onClick={this.handleAddQuay.bind(this)} style={addQuayStyle} mini={true}>
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
    )
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
