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

  handleInputChange(input) {
    this.props.dispatch(UserActions.getTopographicalPlaces(input))
  }

  handleAddChip(result) {
    this.props.dispatch(UserActions.addToposChip(result))
    this.refs.topoFilter.setState({
      searchText: ''
    })
  }

  render() {

    const { stopPlaceFilter, intl, topographicalSource, favorited } = this.props
    const { toggleShowFilter } = this.props

    const { formatMessage, locale } = intl

    let favoriteText = {
      title: formatMessage({id: 'favorites_title'}),
      noFavoritesFoundText: formatMessage({id: 'no_favorites_found'})
    }

    const topoiSourceConfig = {
      text: 'name',
      value: 'ref',
    }

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
          dataSource={topographicalSource}
          dataSourceConfig={topoiSourceConfig}
          filter={AutoComplete.caseInsensitiveFilter}
          onUpdateInput={this.handleInputChange.bind(this)}
          style={{marginBottom: 20}}
          maxSearchResults={5}
          ref="topoFilter"
          onNewRequest={this.handleAddChip.bind(this)}
        />
      </div>
    )
  }
}

export default SearchFilter