import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import cfgreader from '../config/readConfig'
import NewStopPlace from '../components/NewStopPlace'
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
    this.props.dispatch(AjaxActions.populateTopograhicalPlaces())
    this.state = {
      showFilter: false
    }
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
      /* This is a work-around to solve bug in Material-UI causing handleUpdateInput to
       be fired upon handleNewRequest
       */
    } else if (input.indexOf('(') > -1 && input.indexOf(')') > -1) {
      return
    }
    else {
      this.props.dispatch(UserActions.setSearchText(input))
      this.props.dispatch(AjaxActions.getStopNames(input))
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

  handleChangeCoordinates() {
    const { formatMessage } = this.props.intl
    const value = prompt(formatMessage({id: 'set_coordinates_prompt'}), '')

    // simple validation of coordinates
    if (value && value.length && value.split(',').length == 2
      && !isNaN(value.split(',')[0]) && !isNaN(value.split(',')[1])) {

      const { activeMarker } = this.props
      const position = {
        lat: Number(value.split(',')[0]),
        lng: Number(value.split(',')[1])
      }

      this.props.dispatch( MapActions.changeMapCenter(position, 11))
      this.props.dispatch( UserActions.setMissingCoordinates(  position, activeMarker.markerProps.id ))
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

  handleShowFilter() {
    this.setState({
      showFilter: true
    })
  }

  handleHideFilter() {
    this.setState({
      showFilter: false
    })
  }

  render() {

    const { activeMarker, isCreatingNewStop, favorited, missingCoordinatesMap } = this.props
    const { stopPlaceFilter, topographicalSource, dataSource = [] } = this.props
    const { formatMessage, locale } = this.props.intl

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
      zIndex: 999,
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

    if (!favorited) starIconStyle.fill = '#fff'

    const topoiSourceConfig = {
      text: 'name',
      value: 'ref',
    }

    const menuItems = dataSource.map( element => ({
      ...element,
      value: (
          <MenuItem
            autoWidth
            style={{marginTop:5, paddingRight: 25, marginLeft: -10}}
            primaryText={element.text}
            secondaryText={(<ModalityIcon
                iconStyle={{float: 'left', transform: 'translateY(10px)'}}
                type={element.markerProps.stopPlaceType}
              />
            )}
          />
      )}
    ))


    let favoriteText = {
      title: formatMessage({id: 'favorites_title'}),
      noFavoritesFoundText: formatMessage({id: 'no_favorites_found'})
    }

    let { showFilter } = this.state

    return (
      <div>
        <div style={searchBoxWrapperStyle}>
          <div key='search-name-wrapper'>
            <SearchIcon style={{verticalAlign: 'middle', marginRight: 5}}/>
            <AutoComplete
              textFieldStyle={{width: 380}}
              openOnFocus
              hintText={formatMessage({id: "filter_by_name"})}
              dataSource={menuItems}
              filter={(searchText, key) => searchText !== ''}
              onUpdateInput={this.handleUpdateInput.bind(this)}
              maxSearchResults={7}
              searchText={this.props.searchText}
              ref="searchText"
              onNewRequest={this.handleNewRequest.bind(this)}
              listStyle={{width: 'auto'}}
            />
          </div>
          { showFilter
            ? null
            : <RaisedButton onClick={() => {this.handleShowFilter()}}>{formatMessage({id: 'filters'})}</RaisedButton>
          }
          <div style={{float: "right", marginTop: -45}}>
            <IconButton style={{verticalAlign: 'middle'}} onClick={this.handleClearSearch.bind(this)}  iconClassName="material-icons">
              clear
            </IconButton>
          </div>
          { showFilter
            ?  <div key='filter-wrapper' style={{marginTop: 10, width: '95%', border: '1px dotted #191919', padding: 10}}>
              <IconButton
                style={{float: "right"}}
                iconClassName="material-icons"
                onClick={() => { this.handleHideFilter()}}
              >
                remove
              </IconButton>
              <div style={{float: "left", width: "88%", marginBottom: 20}}>
                <FavoritePopover
                  caption={formatMessage({id: "favorites"})}
                  items={[]}
                  filter={stopPlaceFilter}
                  onItemClick={this.handleRetrieveFilter.bind(this)}
                  onDismiss={this.handlePopoverDismiss.bind(this)}
                  text={favoriteText}
                />
              </div>
              <StarIcon
                onClick={() => { this.handleToggleFavorite(!!favorited) }}
                style={starIconStyle}
              />
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
            : null
          }
          <div key='searchbox-edit'>
            {activeMarker
              ?  <SearchBoxDetails
                   text={text}
                   handleEdit={this.handleEdit.bind(this)}
                   marker={activeMarker} handleChangeCoordinates={this.handleChangeCoordinates.bind(this)}
                   userSuppliedCoordinates={missingCoordinatesMap && missingCoordinatesMap[activeMarker.markerProps.id]}
              />
              :  null
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
    favorited: favorited,
    missingCoordinatesMap: state.userReducer.missingCoordsMap,
    searchText: state.userReducer.searchText
  }
}


export default injectIntl(connect(mapStateToProps)(SearchBox))
