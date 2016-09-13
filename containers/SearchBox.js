import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import dataSource from '../config/restMock.js'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { MapActionCreator } from '../actions/'

class SearchBox extends React.Component {

  handleUpdateInput(input) {

  }

  handleNewRequest({ markerProps, location }) {
    if (typeof(markerProps) !== 'undefined') {
      this.props.dispatch(MapActionCreator.setActiveMarkers(markerProps, location))
    }
  }

  render() {

    const suggestions = dataSource.map( (stop, index) => {
        return {
          text: `${stop.name}, ${stop.municipality} (${stop.county})`,
          value: stop.id,
          location: {
            lng: stop.centroid.location.longitude,
            lat: stop.centroid.location.latitude
          },
          markerProps: {
            key: `marker${index}`,
            position: [stop.centroid.location.latitude, stop.centroid.location.longitude],
            children: stop.name
          }
        }
    })

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

    return (
      <div style={SbStyle}>
        <div style={{float: "left", width: "90%"}}>
          <AutoComplete
           hintText="Filtrer på navn"
           dataSource={suggestions}
           filter={AutoComplete.caseInsensitiveFilter}
           onUpdateInput={this.handleUpdateInput}
           maxSearchResults={5}
           onNewRequest={this.handleNewRequest.bind(this)}
           fullWidth={true}
          />
        </div>
        <IconButton style={{float: "right", width: "10%"}} iconClassName="material-icons" tooltip="Search">
          search
        </IconButton>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
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
)(SearchBox)
