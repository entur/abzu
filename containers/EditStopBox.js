import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import dataSource from '../config/restMock.js'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { MapActionCreator } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'

class EditStopBox extends React.Component {

  render() {

    const { activeMarkers } = this.props

    let selectedMarker = null

    if (activeMarkers && activeMarkers.length) {
      selectedMarker = activeMarkers[0]
      console.log(selectedMarker)
    }

    if (selectedMarker == null) return null

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

    const titleSyle = {
      fontWeight: "600",
      marginLeft: "2%"
    }

    const quayStyle = {
      border: "1px solid #e5e5e5",
      padding: "10px"
    }

    const quayItemStyle = {
      color: "#2196F3",
      borderBottom: "1px dotted black",
      cursor: "pointer"
    }


    return (
      <div style={SbStyle}>
        <div>Stoppested:
          <span style={titleSyle}>{selectedMarker.children}</span>
        </div>
        <p>{selectedMarker.description}</p>
        <p>{selectedMarker.type}</p>
        <div style={quayStyle}>
          <h3>Quays</h3>
          { selectedMarker.quays.map( (quay,index) => <span style={quayItemStyle} key={"quay-" + index}>{++index + " " + quay.name}</span>)}
          <button style={{display:"block", marginTop:"20px"}}>+ Quay</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.stopPlacesReducer.activeMarkers,
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
