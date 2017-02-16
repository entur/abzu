import { connect } from 'react-redux'
import React from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { MapActions, UserActions } from '../actions/'
import SearchBoxDetails from '../components/SearchBoxDetails'
import cfgreader from '../config/readConfig'
import NewStopPlace from '../components/NewStopPlace'
import { injectIntl } from 'react-intl'
import MenuItem from 'material-ui/MenuItem'
import ModalityIcon from '../components/ModalityIcon'
import SearchIcon from 'material-ui/svg-icons/action/search'
import FavoriteManager from '../singletons/FavoriteManager'
import CoordinatesDialog from '../components/CoordinatesDialog'
import SearchFilter from '../components/SearchFilter'
import { graphql } from 'react-apollo'
import { findStop } from "../actions/Queries"

class SearchBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showFilter: false,
      coordinatesDialogOpen: false
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
      /* This is a work-around to solve bug in Material-UI causing handleUpdateInput to
       be fired upon handleNewRequest
       */
    } else if (input.indexOf('(') > -1 && input.indexOf(')') > -1) {
      return
    }
    else {
      this.props.data.refetch({
        query: input,
        stopPlaceType: this.props.stopTypeFilter,
        municipalityReference: this.props.topoiChips
          .filter( topos => topos.type === "town").map(topos => topos.value),
        countyReference: this.props.topoiChips
          .filter( topos => topos.type === "county").map(topos => topos.value)
      })
      this.props.dispatch(UserActions.setSearchText(input))
    }
  }

  handleNewRequest(result) {
    if (typeof(result.element) !== 'undefined') {
      this.props.dispatch( MapActions.setMarkerOnMap(result.element) )
    }
  }

  handleChangeCoordinates() {
    this.setState({
      coordinatesDialogOpen: true
    })
   }

  handleSubmitCoordinates(position) {
    this.props.dispatch( MapActions.changeMapCenter(position, 11))
    this.props.dispatch( UserActions.setMissingCoordinates(  position, this.props.chosenResult.id ))

    this.setState(({
      coordinatesDialogOpen: false
    }))
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

  handleToggleFilter(showFilter) {
    this.setState({
      showFilter: showFilter
    })
  }

  componentWillUpdate(nextProps) {

    const {  dataSource = [] } = nextProps

    this._menuItems = dataSource.map( element => ({
        element: element,
        text: element.name,
        value: (
          <MenuItem
            style={{marginTop:5, paddingRight: 25, marginLeft: -10}}
            innerDivStyle={{minWidth: 300}}
            primaryText={`${element.name}, ${element.topographicPlace} (${element.parentTopographicPlace})`}
            secondaryText={(<ModalityIcon
                iconStyle={{float: 'left', transform: 'translateY(10px)'}}
                type={element.stopPlaceType}
              />
            )}
          />
        )}
    ))
  }

  render() {

    const { chosenResult, isCreatingNewStop, favorited, missingCoordinatesMap, intl } = this.props
    const { showFilter, coordinatesDialogOpen } = this.state
    const { formatMessage } = intl

    const newStopText = {
      headerText: formatMessage({id: 'making_stop_place_title'}),
      bodyText: formatMessage({id: 'making_stop_place_hint'})
    }

    const text = {
      emptyDescription: formatMessage({id: 'empty_description'}),
      edit: formatMessage({id: 'edit'})
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

    return (
      <div>
        <CoordinatesDialog
          open={coordinatesDialogOpen}
          handleClose={ () => this.setState({coordinatesDialogOpen: false})}
          handleConfirm={this.handleSubmitCoordinates.bind(this)}
          intl={intl}
        />
        <div style={searchBoxWrapperStyle}>
          <div key='search-name-wrapper'>
            <SearchIcon style={{verticalAlign: 'middle', marginRight: 5}}/>
            <AutoComplete
              textFieldStyle={{width: 380}}
              openOnFocus
              hintText={formatMessage({id: "filter_by_name"})}
              dataSource={this._menuItems || []}
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
            : <RaisedButton onClick={() => { this.handleToggleFilter(true)} }>{formatMessage({id: 'filters'})}</RaisedButton>
          }
          <div style={{float: "right", marginTop: -45}}>
            <IconButton style={{verticalAlign: 'middle'}} onClick={this.handleClearSearch.bind(this)}  iconClassName="material-icons">
              clear
            </IconButton>
          </div>
          { showFilter
            ? <SearchFilter
                intl={intl}
                favorited={favorited}
                dispatch={this.props.dispatch}
                stopPlaceFilter={this.props.stopTypeFilter}
                chipsAdded={this.props.topoiChips}
                toggleShowFilter={() => { this.handleToggleFilter(false)}}
            />
            : null
          }
          <div key='searchbox-edit'>
            {chosenResult
              ?  <SearchBoxDetails
                   handleEdit={this.handleEdit.bind(this)}
                   result={chosenResult}
                   handleChangeCoordinates={this.handleChangeCoordinates.bind(this)}
                   userSuppliedCoordinates={missingCoordinatesMap && missingCoordinatesMap[chosenResult.id]}
                   text={text}
              />
              :  null
            }
            <div style={{marginTop: 30}}>
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

const searchBoxWithConnectedData = graphql(findStop, {
  options: {
    variables: {
      query: '',
      stopPlaceType: undefined,
      municipalityReference: undefined,
      countyReference: undefined
    },
  }
})(SearchBox)

const mapStateToProps = state => {

  var favoriteManager = new FavoriteManager()
  const { stopType, topoiChips, text } = state.user.searchFilters
  var favoriteContent = favoriteManager.createSavableContent('', text, stopType, topoiChips)
  var favorited = favoriteManager.isFavoriteAlreadyStored(favoriteContent)

  return {
    chosenResult: state.stopPlace.activeSearchResult,
    dataSource: state.stopPlace.searchResults,
    isCreatingNewStop: state.user.isCreatingNewStop,
    stopTypeFilter: state.user.searchFilters.stopType,
    topoiChips: state.user.searchFilters.topoiChips,
    favorited: favorited,
    missingCoordinatesMap: state.user.missingCoordsMap,
    searchText: state.user.searchFilters.text
  }
}

export default injectIntl(connect(mapStateToProps)(searchBoxWithConnectedData))
