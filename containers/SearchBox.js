import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import cfgreader from '../config/readConfig'
import NewStopPlace from '../components/NewStopPlace'

class SearchBox extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleEdit(id) {
    this.props.dispatch( UserActions.navigateTo('/edit/', id ) )
  }

  handleUpdateInput(input) {
    this.props.dispatch( AjaxActions.getStopNames(input))
  }

  handleNewRequest(result) {
    if (typeof(result.markerProps) !== 'undefined') {
      this.props.dispatch( MapActions.setActiveMarkers(result) )
    } else {
      console.warn('markerProps is not defined in handleNewRequest')
    }
  }

  handleNewStop() {
    const { dispatch } = this.props
    dispatch( UserActions.toggleIsCreatingNewStop() )
  }

  handleClearSearch() {
    this.refs.searchInput.setState({
      searchText: '',
      open: true,
      focusTextField: true
    })
  }

  render() {

    const { activeMarkers, isCreatingNewStop } = this.props

    let dataSource = this.props.dataSource || []
    let selectedMarker = (activeMarkers && activeMarkers.length) ? activeMarkers[0] : null

    const SbStyle = {
      top: "90px",
      background: "white",
      height: "auto",
      width: "410px",
      margin: "10px",
      position: "absolute",
      zIndex: "2",
      padding: "10px"
    }

    const topLevelMargin = selectedMarker ? "0px" : "60px"

    return (
      <div style={SbStyle}>
        <div style={{marginBottom: topLevelMargin}}>
          <div style={{float: "left", width: "85%"}}>
            <AutoComplete
             hintText="Filtrer på navn"
             dataSource={dataSource}
             filter={AutoComplete.caseInsensitiveFilter}
             onUpdateInput={this.handleUpdateInput.bind(this)}
             maxSearchResults={5}
             ref="searchInput"
             onNewRequest={this.handleNewRequest.bind(this)}
             fullWidth={true}
            />
          </div>
          <div style={{float: "right", width: "10%"}}>
            <IconButton onClick={this.handleClearSearch.bind(this)}  iconClassName="material-icons">
              clear
            </IconButton>
          </div>
        </div>

        {selectedMarker
          ?  <SearchBoxDetails handleEdit={this.handleEdit.bind(this)} marker={selectedMarker}/>
          :  <SearchBoxDetails hidden/>
        }
        <div style={{marginTop: "30px"}}>
          { isCreatingNewStop
          ? <NewStopPlace/>
          :
          <FloatingActionButton
            onClick={this.handleNewStop.bind(this)}
            style={{float: "right"}}
            mini={true}>
            <ContentAdd />
          </FloatingActionButton>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.stopPlacesReducer.activeMarkers,
    dataSource: state.stopPlacesReducer.stopPlaceNames.places,
    isCreatingNewStop: state.userReducer.isCreatingNewStop
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
