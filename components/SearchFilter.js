import React from 'react'
import FilterPopover from './FilterPopover'
import FavoritePopover from './FavoritePopover'
import FavoriteNameDialog from './FavoriteNameDialog'
import stopTypes from './stopTypes'
import TopographicalFilter from './TopographicalFilter'
import StarIcon from 'material-ui/svg-icons/toggle/star'
import IconButton from 'material-ui/IconButton'
import { UserActions } from '../actions/'
import AutoComplete from 'material-ui/AutoComplete'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import MenuItem from 'material-ui/MenuItem'

class SearchFilter extends React.Component {


  handleRetrieveFilter(item) {
    this.props.dispatch(UserActions.loadFavoriteSearch(item))
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

  handleAddChip({ text, type, id }) {
    this.props.dispatch(UserActions.addToposChip({text: text, type: type, value: id}))
    this.refs.topoFilter.setState({
      searchText: ''
    })
  }

  render() {

    const { data, stopPlaceFilter, intl, favorited, chipsAdded } = this.props
    const { toggleShowFilter } = this.props

    const { formatMessage, locale } = intl

    let favoriteText = {
      title: formatMessage({id: 'favorites_title'}),
      noFavoritesFoundText: formatMessage({id: 'no_favorites_found'})
    }

    const topographicalPlaces = !data.topographicPlace
      ? []
      : data.topographicPlace
        .filter( place => chipsAdded.map( chip => chip.value ).indexOf(place.id) == -1)
        .map( place => ({
          text: place.name.value,
          id: place.id,
          value: (
            <MenuItem
              primaryText={place.name.value}
              secondaryText={ formatMessage({id: place.topographicPlaceType}) }
            />
          ),
          type: place.topographicPlaceType
      }))

    let starIconStyle = {
      stroke: '#191919',
      marginTop: 50,
      marginRight: 15,
      height: 32,
      width: 32,
      cursor: 'pointer',
      fill: favorited ? '#ffb504' : '#fff',
      float:'right'
    }

    return (
      <div key='filter-wrapper' style={{marginTop: 10, width: '95%', border: '1px dotted #191919', padding: 10}}>
        <IconButton
          style={{float: "right"}}
          iconClassName="material-icons"
          onClick={() => { () => { toggleShowFilter(false) } }}
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
          allLabel={formatMessage({id: "all"})}
        />
        <TopographicalFilter/>
        <AutoComplete
          hintText={formatMessage({id: "filter_by_topography"})}
          dataSource={topographicalPlaces}
          filter={AutoComplete.caseInsensitiveFilter}
          style={{marginBottom: 20}}
          maxSearchResults={5}
          ref="topoFilter"
          onNewRequest={this.handleAddChip.bind(this)}
        />
      </div>
    )
  }
}


const TopopGraphicalPlacesForFilter = gql`
    query TopopGraphicalPlaces {
        topographicPlace {
            id
            name {
                value
            }
            topographicPlaceType
        }
    }
`

export default graphql(TopopGraphicalPlacesForFilter)(SearchFilter)