import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import dataSource from '../config/restMock.js'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { MapActionCreator } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'

class SearchBox extends React.Component {

  handleUpdateInput(input) {
    // TODO: dispatch action to update our dataSource
  }

  handleNewRequest({ markerProps, location }) {
    if (typeof(markerProps) !== 'undefined') {
      this.props.dispatch(MapActionCreator.setActiveMarkers(markerProps, location))
    }
  }

  handleFocusMap() {
  }

  render() {

    const { activeMarkers } = this.props

    let selectedMarker = null

    if (activeMarkers.length) {
      selectedMarker = activeMarkers[0]
    }

    // TODO - This mapping will of course be moved to action creator from REST response
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
            children: stop.name,
            description: stop.description,
            municipality: stop.municipality,
            county: stop.county,
            quays: stop.quays,
            draggable: false
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
        <div style={{float: "right", width: "10%"}}>
          <IconButton onClick={this.handleFocusMap.bind(this)}  iconClassName="material-icons" tooltip="Search">
            search
          </IconButton>
        </div>
        {selectedMarker
          ?  <SearchBoxDetails marker={selectedMarker}/>
          :  <SearchBoxDetails hidden/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.stopPlacesReducer.activeMarkers
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
