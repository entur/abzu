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
import SelectField from 'material-ui/SelectField'
import FilterPopover from '../components/FilterPopover'
import stopTypes from '../components/stopTypes'

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
    }
  }

  handleNewStop() {
    const { dispatch } = this.props
    dispatch( UserActions.toggleIsCreatingNewStop() )
  }

  handleClearSearch() {
    this.refs.searchInput.setState({
      searchText: '',
      focusTextField: true
    })
  }

  handlePopoverDismiss(filters) {
    const { dispatch } = this.props
    dispatch( UserActions.applyStopTypeSearchFilter(filters) )
  }

  render() {

    const { activeMarkers, isCreatingNewStop, stopPlaceFilter } = this.props

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

    const topLevelMargin = selectedMarker ? "60px" : "100px"

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
          <FilterPopover items={stopTypes} filter={stopPlaceFilter} onDismiss={this.handlePopoverDismiss.bind(this)}/>
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
    isCreatingNewStop: state.userReducer.isCreatingNewStop,
    stopPlaceFilter: state.userReducer.searchFilters.stopType
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
