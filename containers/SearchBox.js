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
import { injectIntl } from 'react-intl'
import TopographicalFilter from '../components/TopographicalFilter'
import MenuItem from 'material-ui/MenuItem'
import ModalityIcon from '../components/ModalityIcon'

class SearchBox extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleEdit(id) {
    this.props.dispatch(UserActions.navigateTo('/edit/', id ))
  }

  handleUpdateInput(input) {
    this.props.dispatch(AjaxActions.getStopNames(input))
  }

  handleTopoInput(input) {
    this.props.dispatch(UserActions.getTopographicalPlaces(input))
  }

  handleNewRequest(result) {
   if (typeof(result.markerProps) !== 'undefined') {
     this.props.dispatch( MapActions.setActiveMarkers(result) )
   }
  }

  handleAddChip(result) {
    let newChip =  {label: result.name, type: result.type}
    this.props.dispatch(UserActions.addToposChip(newChip))
    this.refs.topoFilter.setState({
      searchText: ''
    })
  }

  handleNewStop() {
    this.props.dispatch(UserActions.toggleIsCreatingNewStop())
  }

  handleClearSearch() {
    this.refs.searchText.setState({
      searchText: ''
    })
  }

  handlePopoverDismiss(filters) {
    this.props.dispatch( UserActions.applyStopTypeSearchFilter(filters) )
  }

  handleSaveFavorite(inputField) {
    this.props.dispatch( UserActions.saveSearchAsFavorite(inputField.state.searchText) )
  }

  render() {

    const { activeMarkers, isCreatingNewStop } = this.props
    const { stopPlaceFilter, topographicalSource } = this.props
    const { formatMessage, locale } = this.props.intl

    let dataSource = this.props.dataSource || []
    let selectedMarker = (activeMarkers && activeMarkers.length)
      ? activeMarkers[0] : null

    let text = {
      emptyDescription: formatMessage({id: 'empty_description'}),
      edit: formatMessage({id: 'edit'})
    }

    let newStopText = {
      headerText: formatMessage({id: 'making_stop_place_title'}),
      bodyText: formatMessage({id: 'making_stop_place_hint'})
    }

    const searchBoxWrapperStyle = {
      top: "90px",
      background: "white",
      height: "auto",
      width: "410px",
      margin: "10px",
      position: "absolute",
      zIndex: "2",
      padding: "10px",
      border: "1px solid rgb(81, 30, 18)"
    }

    const topoiSourceConfig = {
      text: 'name',
      value: 'ref',
    }

    dataSource.map( (r) => {
      r.value = (
        <MenuItem
          primaryText={r.text}
          secondaryText={(<ModalityIcon type={r.markerProps.stopPlaceType}/>)}
       />
      )
      return r
    })

    return (
      <div style={searchBoxWrapperStyle}>
        <div key='search-name-wrapper'>
          <div style={{float: "left", width: "85%"}}>
            <AutoComplete
             openOnFocus={true}
             hintText={formatMessage({id: "filter_by_name"})}
             dataSource={dataSource}
             filter={AutoComplete.caseInsensitiveFilter}
             onUpdateInput={this.handleUpdateInput.bind(this)}
             maxSearchResults={5}
             ref="searchText"
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
        <div key='filter-wrapper' style={{width: '100%'}}>
          <span style={{fontWeight: 600}}>Filter:</span>
          <FilterPopover
            caption={formatMessage({id: "type"})}
            items={stopTypes[locale]}
            filter={stopPlaceFilter}
            onDismiss={this.handlePopoverDismiss.bind(this)}
            />
          <button onClick={() => { this.handleSaveFavorite(this.refs.searchText) }} style={{display: 'none', float:'right'}}>*FAV*</button>
            <TopographicalFilter/>
              <AutoComplete
               hintText={formatMessage({id: "filter_by_topography"})}
               dataSource={topographicalSource}
               dataSourceConfig={topoiSourceConfig}
               filter={AutoComplete.caseInsensitiveFilter}
               onUpdateInput={this.handleTopoInput.bind(this)}
               maxSearchResults={5}
               ref="topoFilter"
               onNewRequest={this.handleAddChip.bind(this)}
              />
        </div>
        <div key='searchbox-edit'>
          {selectedMarker
            ?  <SearchBoxDetails text={text} handleEdit={this.handleEdit.bind(this)} marker={selectedMarker}/>
            :  <SearchBoxDetails hidden/>
          }
          <div style={{marginTop: "30px"}}>
            { isCreatingNewStop
            ? <NewStopPlace text={newStopText}/>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.stopPlacesReducer.activeMarkers,
    dataSource: state.stopPlacesReducer.stopPlaceNames.places,
    isCreatingNewStop: state.userReducer.isCreatingNewStop,
    stopPlaceFilter: state.userReducer.searchFilters.stopType,
    topographicalSource: state.userReducer.topoi
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}


export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBox))
