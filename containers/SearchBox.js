import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import cfgreader from '../config/readConfig'
import NewStopPlace from '../components/NewStopPlace'
import SelectField from 'material-ui/SelectField'
import FilterPopover from '../components/FilterPopover'
import FavoritePopover from '../components/FavoritePopover'
import FavoriteNameDialog from '../components/FavoriteNameDialog'
import stopTypes from '../components/stopTypes'
import { injectIntl } from 'react-intl'
import TopographicalFilter from '../components/TopographicalFilter'
import MenuItem from 'material-ui/MenuItem'
import ModalityIcon from '../components/ModalityIcon'
import SearchIcon from 'material-ui/svg-icons/action/search'
import StarIcon from 'material-ui/svg-icons/toggle/star'
import FavoriteManager from '../singletons/FavoriteManager'

class SearchBox extends React.Component {

  constructor(props) {
    super(props)
    var favoriteManager = new FavoriteManager()
    this.props.dispatch(AjaxActions.populateTopograhicalPlaces())
  }

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleEdit(id) {
    this.props.dispatch(UserActions.navigateTo('/edit/', id ))
  }

  handleUpdateInput(input) {
    if (!input || !input.length) {
      this.props.dispatch(UserActions.clearSearchResults())
    } else {
      this.props.dispatch(AjaxActions.getStopNames(input))
      this.props.dispatch(UserActions.setSearchText(input))
    }
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
    this.props.dispatch(UserActions.addToposChip(result))
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
    this.props.dispatch(UserActions.setSearchText(''))
  }

  handlePopoverDismiss(filters) {
    this.props.dispatch( UserActions.applyStopTypeSearchFilter(filters) )
  }

  handleToggleFavorite(favorited) {

    if (!favorited) {
      this.props.dispatch(UserActions.openFavoriteNameDialog())
    } else {
      this.props.dispatch(UserActions.removeSearchAsFavorite())
    }
  }

  handleRetrieveFilter(item) {
    this.props.dispatch(UserActions.loadFavoriteSearch(item))
  }

  render() {

    const { activeMarker, isCreatingNewStop, searchText, favorited } = this.props
    const { stopPlaceFilter, topographicalSource, topoiChips } = this.props
    const { formatMessage, locale } = this.props.intl

    let dataSource = this.props.dataSource || []

    let text = {
      emptyDescription: formatMessage({id: 'empty_description'}),
      edit: formatMessage({id: 'edit'})
    }

    let newStopText = {
      headerText: formatMessage({id: 'making_stop_place_title'}),
      bodyText: formatMessage({id: 'making_stop_place_hint'})
    }

    const searchBoxWrapperStyle = {
      top: 90,
      background: "white",
      height: "auto",
      width: 460,
      margin: 10,
      position: "absolute",
      zIndex: 2,
      padding: 10,
      border: "1px solid rgb(81, 30, 18)"
    }

    let starIconStyle = {
      stroke: '#191919',
      marginTop: 50,
      marginRight: 15,
      height: 32,
      width: 32,
      cursor: 'pointer',
      fill: '#ffb504',
      float:'right'
    }

    let newStopStyle = {
      borderTop: '1px solid #191919'
    }

    if (!favorited) starIconStyle.fill = '#fff'

    const topoiSourceConfig = {
      text: 'name',
      value: 'ref',
    }

    let dataSourceContent = []

    dataSource.forEach( (r) => {
      r.value = (
        <MenuItem
          style={{marginTop:5, marginLeft: -10}}
          primaryText={r.text}
          secondaryText={(<ModalityIcon
            iconStyle={{float: 'left', transform: 'translateY(10px)'}}
            type={r.markerProps.stopPlaceType}
            />
        )}
       />
      )
      dataSourceContent.push(r)
    })

    let dataSourceWrapper = () => {
      return (
        <div>
          <p>Dine søk</p>
        </div>
      )
    }

    let favoriteText = {
      title: formatMessage({id: 'favorites_title'}),
      noFavoritesFoundText: formatMessage({id: 'no_favorites_found'})
    }

    return (
      <div>
        <div style={searchBoxWrapperStyle}>
          <div key='search-name-wrapper'>
            <div style={{float: "left", width: "88%"}}>
              <FavoritePopover
                caption={formatMessage({id: "favorites"})}
                items={[]}
                filter={stopPlaceFilter}
                onItemClick={this.handleRetrieveFilter.bind(this)}
                onDismiss={this.handlePopoverDismiss.bind(this)}
                text={favoriteText}
                />
            <div>
              <SearchIcon style={{verticalAlign: 'middle', marginRight: 5}}/>
              <AutoComplete
                 textFieldStyle={{width: 380}}
                 openOnFocus={true}
                 hintText={formatMessage({id: "filter_by_name"})}
                 dataSource={dataSourceContent}
                 filter={() => true}
                 onUpdateInput={this.handleUpdateInput.bind(this)}
                 maxSearchResults={5}
                 searchText={searchText}
                 ref="searchText"
                 onNewRequest={this.handleNewRequest.bind(this)}
                 listStyle={{width: 380}}
                />
            </div>
            </div>
            <div style={{float: "right", marginTop: 41}}>
              <IconButton style={{verticalAlign: 'middle'}} onClick={this.handleClearSearch.bind(this)}  iconClassName="material-icons">
                clear
              </IconButton>
            </div>
            <StarIcon
              onClick={() => { this.handleToggleFavorite(!!favorited) }}
              style={starIconStyle}
              />
          </div>
          <div key='filter-wrapper' style={{marginTop: 120, width: '100%'}}>
            <FavoriteNameDialog/>
            <FilterPopover
              caption={formatMessage({id: "type"})}
              items={stopTypes[locale]}
              filter={stopPlaceFilter}
              onDismiss={this.handlePopoverDismiss.bind(this)}
              />
              <TopographicalFilter/>
                <AutoComplete
                 hintText={formatMessage({id: "filter_by_topography"})}
                 dataSource={topographicalSource}
                 dataSourceConfig={topoiSourceConfig}
                 filter={AutoComplete.caseInsensitiveFilter}
                 onUpdateInput={this.handleTopoInput.bind(this)}
                 style={{marginBottom: 20}}
                 maxSearchResults={5}
                 ref="topoFilter"
                 onNewRequest={this.handleAddChip.bind(this)}
                />
          </div>
          <div key='searchbox-edit' style={newStopStyle}>
            {activeMarker
              ?  <SearchBoxDetails text={text} handleEdit={this.handleEdit.bind(this)} marker={activeMarker}/>
              :  <SearchBoxDetails hidden/>
            }
            <div style={{marginTop: "30px"}}>
              { isCreatingNewStop
              ? <NewStopPlace text={newStopText}/>
              :
              <RaisedButton
                onClick={this.handleNewStop.bind(this)}
                style={{float: "right"}}
                icon={<ContentAdd/>}
                primary={true}
                label={formatMessage({id: 'new_stop'})}
                mini={true}
              />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  var favoriteManager = new FavoriteManager()
  const { stopType, topoiChips, text } = state.userReducer.searchFilters
  var favoriteContent = favoriteManager.createSavableContent('', text, stopType, topoiChips)
  var favorited = favoriteManager.isFavoriteAlreadyStored(favoriteContent)

  return {
    activeMarker: state.stopPlacesReducer.activeMarker,
    dataSource: state.stopPlacesReducer.stopPlaceNames.places,
    isCreatingNewStop: state.userReducer.isCreatingNewStop,
    stopPlaceFilter: state.userReducer.searchFilters.stopType,
    topographicalSource: state.userReducer.topoiSuggestions,
    topoiChips: state.userReducer.searchFilters.topoiChips,
    searchText: state.userReducer.searchFilters.text,
    favorited: favorited
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
