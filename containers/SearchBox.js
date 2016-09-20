import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { MapActionCreator, AjaxCreator } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

class SearchBox extends React.Component {

  handleEdit(id) {
    this.props.dispatch(AjaxCreator.getStop(id))
    browserHistory.push('/edit')
  }

  handleUpdateInput(input) {
    this.props.dispatch(AjaxCreator.getStopNames(input))
  }

  handleNewRequest(result) {
    if (typeof(result.markerProps) !== 'undefined') {
      this.props.dispatch(MapActionCreator.setActiveMarkers(result))
    } else {
      console.warn('markerProps is not defined in handleNewRequest')
    }
  }

  handleFocusMap() {
  }

  render() {

    const { activeMarkers } = this.props

    let dataSource = this.props.dataSource || []
    let selectedMarker = (activeMarkers && activeMarkers.length) ? activeMarkers[0] : null

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
           dataSource={dataSource}
           filter={AutoComplete.caseInsensitiveFilter}
           onUpdateInput={this.handleUpdateInput.bind(this)}
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
          ?  <SearchBoxDetails handleEdit={::this.handleEdit} marker={selectedMarker}/>
          :  <SearchBoxDetails hidden/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.stopPlacesReducer.activeMarkers,
    dataSource: state.stopPlacesReducer.stopPlaceNames.places
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
