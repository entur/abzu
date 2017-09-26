/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MdMore from 'material-ui/svg-icons/navigation/expand-more';
import { StopPlaceActions, UserActions } from '../../actions/';
import SearchBoxDetails from './SearchBoxDetails';
import NewStopPlace from './CreateNewStop';
import { injectIntl } from 'react-intl';
import MenuItem from 'material-ui/MenuItem';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FavoriteManager from '../../singletons/FavoriteManager';
import CoordinatesDialog from '../Dialogs/CoordinatesDialog';
import {
  findStopWithFilters,
  findTopographicalPlace
} from '../../graphql/Actions';
import { withApollo } from 'react-apollo';
import FavoritePopover from './FavoritePopover';
import ModalityFilter from '../EditStopPage/ModalityFilter';
import FavoriteNameDialog from '../Dialogs/FavoriteNameDialog';
import TopographicalFilter from './TopographicalFilter';
import Divider from 'material-ui/Divider';
import debounce from 'lodash.debounce';
import { getIn } from '../../utils/';
import { enturPrimaryDarker } from '../../config/enturTheme';
import MdLocationSearching from 'material-ui/svg-icons/device/location-searching';
import MdSpinner from '../../static/icons/spinner';
import { createSearchMenuItem } from './SearchMenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import CheckBox from 'material-ui/Checkbox';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreFilterOptions: false,
      createNewStopOpen: false,
      coordinatesDialogOpen: false,
      loading: false
    };

    const searchStop = (searchText, dataSource, params, filter) => {
      const chips = filter ? filter.topoiChips : this.props.topoiChips;
      const showFutureAndExpired = filter
        ? filter.showFutureAndExpired
        : this.props.showFutureAndExpired;
      const stopPlaceTypes = filter
        ? filter.stopType
        : this.props.stopTypeFilter;

      this.setState({ loading: true });

      findStopWithFilters(
        this.props.client,
        searchText,
        stopPlaceTypes,
        chips,
        showFutureAndExpired
      ).then(response => {
        this.setState({ loading: false });
      });
    };
    this.debouncedSearch = debounce(searchStop, 200);
  }

  handleSearchUpdate(searchText, dataSource, params, filter) {
    if (!searchText || !searchText.length) {
      this.props.dispatch(UserActions.clearSearchResults());
      this.props.dispatch(UserActions.setSearchText(''));
    } else if (searchText.indexOf('(') > -1 && searchText.indexOf(')') > -1) {
      return;
    } else {
      this.props.dispatch(UserActions.setSearchText(searchText));
      this.debouncedSearch(searchText, dataSource, params, filter);
    }
  }

  handleEdit(id) {
    this.props.dispatch(UserActions.navigateTo('/edit/', id));
  }

  handleSaveAsFavorite() {
    this.props.dispatch(UserActions.openFavoriteNameDialog());
  }

  removeFiltersAndSearch() {
    this.props.dispatch(UserActions.removeAllFilters());
    this.handleSearchUpdate(this.props.searchText, null, null, {
      topoiChips: [],
      stopTypeFilter: []
    });
  }

  handleRetrieveFilter(filter) {
    this.props.dispatch(UserActions.loadFavoriteSearch(filter));
    this.handleSearchUpdate(filter.searchText, null, null, filter);

    this.refs.searchText.setState({
      open: true,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchText)
    });
  }

  handlePopoverDismiss(filters) {
    this.props.dispatch(UserActions.applyStopTypeSearchFilter(filters));
  }

  toggleShowFutureAndExpired(value) {
    const { searchText, topoiChips, stopTypeFilter } = this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired: value,
        topoiChips,
        stopType: stopTypeFilter
      });
    }
    this.props.dispatch(UserActions.toggleShowFutureAndExpired(value));
  }

  handleTopographicalPlaceInput(searchText) {
    const { client } = this.props;
    findTopographicalPlace(client, searchText);
  }

  handleNewRequest(result) {
    if (typeof result.element !== 'undefined') {
      this.props.dispatch(StopPlaceActions.setMarkerOnMap(result.element));
    }
  }

  handleOpenCoordinatesDialog() {
    this.setState({
      coordinatesDialogOpen: true
    });
  }

  handleOpenLookupCoordinatesDialog() {
    this.props.dispatch(UserActions.openLookupCoordinatesDialog());
  }

  handleCloseLookupCoordinatesDialog() {
    this.props.dispatch(UserActions.closeLookupCoordinatesDialog());
  }

  handleApplyModalityFilters(filters) {
    const { searchText, showFutureAndExpired, topoiChips } = this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired,
        topoiChips,
        stopType: filters
      });
    }
    this.props.dispatch(UserActions.applyStopTypeSearchFilter(filters));
  }

  handleSubmitCoordinates(position) {
    this.props.dispatch(StopPlaceActions.changeMapCenter(position, 11));
    this.props.dispatch(
      UserActions.setMissingCoordinates(position, this.props.chosenResult.id)
    );

    this.setState({
      coordinatesDialogOpen: false
    });
  }

  handleAddChip({ text, type, id }) {
    const { searchText, stopTypeFilters, showFutureAndExpired, topoiChips } = this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired,
        topoiChips: topoiChips.concat({
          text, type, value: id
        }),
        stopType: stopTypeFilters
      });
    }
    this.props.dispatch(
      UserActions.addToposChip({ text: text, type: type, value: id })
    );
    this.refs.topoFilter.setState({
      searchText: ''
    });
  }

  handleDeleteChip(chipValue) {
    const { dispatch, searchText, stopTypeFilters, showFutureAndExpired, topoiChips } = this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired,
        topoiChips: topoiChips.filter(chip => chip.value !== chipValue),
        stopType: stopTypeFilters
      });
    }
    dispatch(UserActions.deleteChip(chipValue));
  }

  handleNewStop(isMultiModal) {
    this.props.dispatch(UserActions.toggleIsCreatingNewStop(isMultiModal));
  }

  handleLookupCoordinates(position) {
    this.props.dispatch(UserActions.lookupCoordinates(position, false));
    this.handleCloseLookupCoordinatesDialog();
  }

  handleClearSearch() {
    this.refs.searchText.setState({
      searchText: ''
    });
    this.props.dispatch(UserActions.setSearchText(''));
  }

  handleToggleFilter(value) {
    this.setState({
      showMoreFilterOptions: value
    });
  }

  getTopographicalNames(topographicalPlace) {
    let name = topographicalPlace.name.value;

    if (
      topographicalPlace.topographicPlaceType === 'town' &&
      topographicalPlace.parentTopographicPlace
    ) {
      name += `, ${topographicalPlace.parentTopographicPlace.name.value}`;
    }
    return name;
  }

  getMenuItems(nextProps) {
    const { dataSource, topoiChips, stopTypeFilter } = nextProps;
    const { formatMessage } = nextProps.intl;
    let menuItems = [];

    if (dataSource && dataSource.length) {
      menuItems = dataSource.map(element =>
        createSearchMenuItem(element, formatMessage)
      );
    } else {
      menuItems = [
        {
          text: '',
          value: (
            <MenuItem
              style={{ paddingRight: 10, width: 'auto' }}
              primaryText={
                <div style={{ fontWeight: 600, fontSize: '0.8em' }}>
                  {formatMessage({ id: 'no_results_found' })}
                </div>
              }
            />
          )
        }
      ];
    }

    if (stopTypeFilter.length || topoiChips.length) {
      const filterNotification = {
        text: '',
        value: (
          <MenuItem
            style={{
              paddingRight: 10,
              width: 'auto',
              paddingTop: 2,
              paddingBottom: 2
            }}
            disabled={true}
            primaryText={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #000'
                }}
              >
                <span style={{ fontSize: '0.8em', color: '#777' }}>
                  {formatMessage({ id: 'filters_are_applied' })}
                </span>
                <span
                  onClick={() => this.removeFiltersAndSearch()}
                  style={{
                    fontSize: '0.8em',
                    color: enturPrimaryDarker,
                    marginRight: 5,
                    cursor: 'pointer'
                  }}
                >
                  {formatMessage({ id: 'remove' })}
                </span>
              </div>
            }
          />
        )
      };

      if (menuItems.length > 6) {
        menuItems[6] = filterNotification;
      } else {
        menuItems.push(filterNotification);
      }
    }
    return menuItems;
  }

  render() {
    const {
      chosenResult,
      isCreatingNewStop,
      favorited,
      missingCoordinatesMap,
      intl,
      stopTypeFilter,
      topoiChips,
      topographicalPlaces,
      canEdit,
      isGuest,
      lookupCoordinatesOpen,
      newStopIsMultiModal,
      dataSource,
      showFutureAndExpired
    } = this.props;
    const {
      coordinatesDialogOpen,
      showMoreFilterOptions,
      loading
    } = this.state;

    const { formatMessage, locale } = intl;
    const menuItems = this.getMenuItems(this.props);

    const Loading = loading &&
    !dataSource.length && [
      {
        text: '',
        value: (
          <MenuItem
            style={{ paddingRight: 10, width: 'auto' }}
            primaryText={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.8em',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <MdSpinner />
                <div style={{ marginLeft: 5 }}>
                  {formatMessage({ id: 'loading' })}
                </div>
              </div>
            }
          />
        )
      }
    ];

    const topographicalPlacesDataSource = topographicalPlaces
      .filter(
        place =>
          place.topographicPlaceType === 'county' ||
          place.topographicPlaceType === 'town'
      )
      .filter(
        place => topoiChips.map(chip => chip.value).indexOf(place.id) == -1
      )
      .map(place => {
        let name = this.getTopographicalNames(place);
        return {
          text: name,
          id: place.id,
          value: (
            <MenuItem
              primaryText={name}
              style={{fontSize: '0.8em'}}
              secondaryText={formatMessage({ id: place.topographicPlaceType })}
            />
          ),
          type: place.topographicPlaceType
        };
      });

    const newStopText = {
      headerText: formatMessage({
        id: newStopIsMultiModal
          ? 'making_parent_stop_place_title'
          : 'making_stop_place_title'
      }),
      bodyText: formatMessage({ id: 'making_stop_place_hint' })
    };

    let favoriteText = {
      title: formatMessage({ id: 'favorites_title' }),
      noFavoritesFoundText: formatMessage({ id: 'no_favorites_found' })
    };

    const text = {
      emptyDescription: formatMessage({ id: 'empty_description' }),
      edit: formatMessage({ id: 'edit' }),
      view: formatMessage({ id: 'view' })
    };

    const searchBoxWrapperStyle = {
      top: 60,
      background: '#fff',
      height: 'auto',
      width: 460,
      margin: 8,
      position: 'absolute',
      zIndex: 999,
      padding: 8,
      border: '1px solid rgb(81, 30, 18)'
    };

    return (
      <div>
        <CoordinatesDialog
          open={lookupCoordinatesOpen}
          handleClose={this.handleCloseLookupCoordinatesDialog.bind(this)}
          handleConfirm={this.handleLookupCoordinates.bind(this)}
          titleId={'lookup_coordinates'}
          intl={intl}
        />
        <CoordinatesDialog
          open={coordinatesDialogOpen}
          handleClose={() => this.setState({ coordinatesDialogOpen: false })}
          handleConfirm={this.handleSubmitCoordinates.bind(this)}
          intl={intl}
        />
        <FavoriteNameDialog />
        <div style={searchBoxWrapperStyle}>
          <div key="search-name-wrapper">
            <FavoritePopover
              caption={formatMessage({ id: 'favorites' })}
              items={[]}
              filter={stopTypeFilter}
              onItemClick={this.handleRetrieveFilter.bind(this)}
              onDismiss={this.handlePopoverDismiss.bind(this)}
              text={favoriteText}
            />
            <div
              style={{
                width: '100%',
                margin: 'auto',
                border: '1px solid hsla(182, 53%, 51%, 0.1)'
              }}
            >
              <ModalityFilter
                locale={locale}
                stopTypeFilter={stopTypeFilter}
                handleApplyFilters={this.handleApplyModalityFilters.bind(this)}
              />
              {showMoreFilterOptions
                ? <div>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <FlatButton
                        onClick={() => this.handleToggleFilter(false)}
                        style={{ fontSize: 12 }}
                      >
                        {formatMessage({ id: 'filters_less' })}
                      </FlatButton>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <AutoComplete
                        floatingLabelText={formatMessage({
                          id: 'filter_by_topography'
                        })}
                        hintText={formatMessage({ id: 'filter_by_topography' })}
                        dataSource={topographicalPlacesDataSource}
                        onUpdateInput={this.handleTopographicalPlaceInput.bind(
                          this
                        )}
                        filter={AutoComplete.caseInsensitiveFilter}
                        style={{
                          margin: 'auto',
                          width: '100%',
                          marginTop: -20,
                        }}
                        maxSearchResults={5}
                        ref="topoFilter"
                        onNewRequest={this.handleAddChip.bind(this)}
                      />
                      <CheckBox
                        checked={showFutureAndExpired}
                        onCheck={(e, value) =>
                          this.toggleShowFutureAndExpired(value)}
                        label={formatMessage({ id: 'show_future_and_expired' })}
                        labelStyle={{ fontSize: '0.8em' }}
                      />
                    </div>
                    <TopographicalFilter
                      topoiChips={topoiChips}
                      handleDeleteChip={this.handleDeleteChip.bind(this)}
                    />
                  </div>
                : <div style={{ width: '100%', textAlign: 'center' }}>
                    <FlatButton
                      style={{ fontSize: 12 }}
                      onClick={() => this.handleToggleFilter(true)}
                    >
                      {formatMessage({ id: 'filters_more' })}
                    </FlatButton>
                  </div>}
            </div>
            <SearchIcon
              style={{
                verticalAlign: 'middle',
                marginRight: 5,
                height: 22,
                width: 22
              }}
            />
            <AutoComplete
              textFieldStyle={{ width: 380 }}
              animated={false}
              openOnFocus
              hintText={formatMessage({ id: 'filter_by_name' })}
              dataSource={
                loading && !dataSource.length ? Loading : menuItems || []
              }
              filter={(searchText, key) => searchText !== ''}
              onUpdateInput={this.handleSearchUpdate.bind(this)}
              maxSearchResults={7}
              searchText={this.props.searchText}
              ref="searchText"
              onNewRequest={this.handleNewRequest.bind(this)}
              listStyle={{ width: 'auto' }}
            />
            <div style={{ float: 'right' }}>
              <IconButton
                style={{ verticalAlign: 'middle' }}
                iconStyle={{ fontSize: 22 }}
                onClick={this.handleClearSearch.bind(this)}
                iconClassName="material-icons"
              >
                clear
              </IconButton>
            </div>
            <Divider />
          </div>
          <div style={{ marginBottom: 5, textAlign: 'right', marginRight: 10 }}>
            <FlatButton
              style={{ marginLeft: 10, fontSize: 12 }}
              disabled={!!favorited}
              secondary={true}
              onClick={() => {
                this.handleSaveAsFavorite(!!favorited);
              }}
            >
              {formatMessage({ id: 'filter_save_favorite' })}
            </FlatButton>
          </div>
          <div key="searchbox-edit">
            {chosenResult
              ? <SearchBoxDetails
                  handleEdit={this.handleEdit.bind(this)}
                  result={chosenResult}
                  handleChangeCoordinates={this.handleOpenCoordinatesDialog.bind(
                    this
                  )}
                  userSuppliedCoordinates={
                    missingCoordinatesMap &&
                    missingCoordinatesMap[chosenResult.id]
                  }
                  text={text}
                  canEdit={canEdit}
                  formatMessage={formatMessage}
                />
              : null}
            {!isGuest &&
              <div style={{ marginTop: 10 }}>
                {isCreatingNewStop
                  ? <NewStopPlace
                      text={newStopText}
                      onClose={() =>
                        this.setState({ createNewStopOpen: false })}
                    />
                  : <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <RaisedButton
                        onClick={this.handleOpenLookupCoordinatesDialog.bind(
                          this
                        )}
                        icon={
                          <MdLocationSearching
                            style={{ width: 20, height: 20 }}
                          />
                        }
                        primary={false}
                        labelStyle={{ fontSize: 11 }}
                        label={formatMessage({ id: 'lookup_coordinates' })}
                      />
                      <RaisedButton
                        onClick={e => {
                          this.setState({
                            createNewStopOpen: true,
                            anchorEl: e.currentTarget
                          });
                        }}
                        icon={<MdMore style={{ width: 20, height: 20 }} />}
                        primary={true}
                        labelStyle={{ fontSize: 11 }}
                        label={formatMessage({ id: 'new_stop' })}
                      />
                      <Popover
                        open={this.state.createNewStopOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{
                          horizontal: 'left',
                          vertical: 'bottom'
                        }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        onRequestClose={() => {
                          this.setState({ createNewStopOpen: false });
                        }}
                      >
                        <Menu>
                          <MenuItem
                            onClick={() => this.handleNewStop(false)}
                            style={{ fontSize: '0.9em' }}
                            primaryText={formatMessage({ id: 'new_stop' })}
                          />
                          <MenuItem
                            onClick={() => this.handleNewStop(true)}
                            style={{ fontSize: '0.9em' }}
                            primaryText={formatMessage({
                              id: 'new__multi_stop'
                            })}
                          />
                        </Menu>
                      </Popover>
                    </div>}
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const favoriteManager = new FavoriteManager();
  const { stopType, topoiChips, text } = state.user.searchFilters;
  const favoriteContent = favoriteManager.createSavableContent(
    '',
    text,
    stopType,
    topoiChips
  );
  const favorited = favoriteManager.isFavoriteAlreadyStored(favoriteContent);

  return {
    chosenResult: state.stopPlace.activeSearchResult,
    dataSource: state.stopPlace.searchResults || [],
    isCreatingNewStop: state.user.isCreatingNewStop,
    stopTypeFilter: state.user.searchFilters.stopType,
    topoiChips: state.user.searchFilters.topoiChips,
    favorited: favorited,
    missingCoordinatesMap: state.user.missingCoordsMap,
    searchText: state.user.searchFilters.text,
    topographicalPlaces: state.stopPlace.topographicalPlaces || [],
    canEdit: getIn(
      state.roles,
      ['allowanceInfoSearchResult', 'canEdit'],
      false
    ),
    isGuest: state.roles.isGuest,
    lookupCoordinatesOpen: state.user.lookupCoordinatesOpen,
    newStopIsMultiModal: state.user.newStopIsMultiModal,
    showFutureAndExpired: state.user.searchFilters.showFutureAndExpired
  };
};

export default withApollo(injectIntl(connect(mapStateToProps)(SearchBox)));
