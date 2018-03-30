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

import React from 'react';
import { connect } from 'react-redux';
import ReportPageFooter from '../components/ReportPage/ReportPageFooter';
import ReportResultView from '../components/ReportPage/ReportResultView';
import ReportFilterBox from '../components/ReportPage/ReportFilterBox';
import ModalityFilter from '../components/EditStopPage/ModalityFilter';
import TopographicalFilter from '../components/MainPage/TopographicalFilter';
import AutoComplete from 'material-ui/AutoComplete';
import { withApollo } from 'react-apollo';
import {
  topopGraphicalPlacesReportQuery,
  findStopForReport
} from '../graphql/Tiamat/queries';
import { getTopographicPlaces } from '../graphql/Tiamat/actions';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MdSpinner from '../static/icons/spinner';
import MdSearch from 'material-ui/svg-icons/action/search';
import ColumnFilterPopover from '../components/EditStopPage/ColumnFilterPopover';
import { getParkingForMultipleStopPlaces } from '../graphql/Tiamat/queries';
import { reportReducer } from '../reducers/';
import { injectIntl } from 'react-intl';
import { columnOptionsQuays, columnOptionsStopPlace } from '../config/columnOptions';
import { buildReportSearchQuery, extractQueryParamsFromUrl } from '../utils/URLhelpers';
import TagFilterTray from '../components/ReportPage/TagFilterTray';
import AdvancedReportFilters from '../components/ReportPage/AdvancedReportFilters';

class ReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopTypeFilter: [],
      quayMin: 0,
      quayMax: 10,
      topoiChips: [],
      activePageIndex: 0,
      searchQuery: '',
      isLoading: false,
      columnOptionsQuays: columnOptionsQuays,
      columnOptionsStopPlace: columnOptionsStopPlace,
      withoutLocationOnly: false,
      withDuplicateImportedIds: false,
      withNearbySimilarDuplicates: false,
      showFutureAndExpired: false,
      withTags: false,
      tags: [],
      filterByOrg: false
    };
  }

  handleSelectPage(pageIndex) {
    this.setState({
      activePageIndex: pageIndex
    });
  }

  handleOnKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  handleCheckAllColumnQuays() {
    this.setState({
      columnOptionsQuays: columnOptionsQuays.map(option => ({
        ...option,
        checked: true
      }))
    });
  }

  handleApplyModalityFilters(filters) {
    this.setState({ stopTypeFilter: filters });
  }

  handleSearchQueryChange(searchQuery) {
    this.setState({ searchQuery });
  }

  handleItemOnCheck(name, checked) {
    let nextTags = this.state.tags.slice();
    if (checked) {
      nextTags.push(name);
    } else {
      nextTags = nextTags.filter(tag => tag !== name);
    }
    this.setState({
      tags: nextTags
    });
  }

  handleCheckAllColumnStops() {
    this.setState({
      columnOptionsStopPlace: columnOptionsStopPlace.map(option => ({
        ...option,
        checked: true
      }))
    });
  };

  handleFilterChange(key, value) {
    this.setState({
      [ key ]: value
    });
  };

  handleColumnStopPlaceCheck(id, checked) {
    const columnOptions = this.state.columnOptionsStopPlace.slice();

    for (let i = 0; columnOptions.length > i; i++) {
      let option = columnOptions[ i ];
      if (option.id === id) {
        option.checked = checked;
        columnOptions[ i ] = option;
        break;
      }
    }

    this.setState({
      columnOptionsStopPlace: columnOptions
    });
  }

  handleColumnQuaysCheck(id, checked) {
    const columnOptions = this.state.columnOptionsQuays.slice();

    for (let i = 0; columnOptions.length > i; i++) {
      let option = columnOptions[ i ];
      if (option.id === id) {
        option.checked = checked;
        columnOptions[ i ] = option;
        break;
      }
    }

    this.setState({
      columnOptionsQuays: columnOptions
    });
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl;
    const { client } = this.props;
    document.title = formatMessage({ id: '_report_page' });
    const fromURL = extractQueryParamsFromUrl();
    this.setState({
      searchQuery: fromURL.query || '',
      withoutLocationOnly: fromURL.withoutLocationOnly == 'true',
      withNearbySimilarDuplicates: fromURL.withNearbySimilarDuplicates == 'true',
      withDuplicateImportedIds: fromURL.withDuplicateImportedIds == 'true',
      showFutureAndExpired: fromURL.showFutureAndExpired == 'true',
      withTags: fromURL.withTags == 'true',
      tags: fromURL.tags ? fromURL.tags.split(',') : [],
      stopTypeFilter: fromURL.stopPlaceType
        ? fromURL.stopPlaceType.split(',')
        : []
    });

    let topographicalPlaceIds = [];
    if (fromURL.municipalityReference) {
      topographicalPlaceIds = topographicalPlaceIds.concat(
        fromURL.municipalityReference.split(',')
      );
    }

    if (fromURL.countyReference) {
      topographicalPlaceIds = topographicalPlaceIds.concat(
        fromURL.countyReference.split(',')
      );
    }

    if (topographicalPlaceIds.length) {
      getTopographicPlaces(client, topographicalPlaceIds).then(response => {
        if (response.data && Object.keys(response.data).length) {
          let menuItems = [];

          Object.keys(response.data).forEach(result => {
            const place = response.data[ result ] && response.data[ result ].length
              ? response.data[ result ][ 0 ]
              : null;

            if (place) {
              const menuItem = this.createTopographicPlaceMenuItem(
                place,
                formatMessage
              );
              menuItems.push(menuItem);
            }
          });

          this.setState({
            topoiChips: menuItems
          });
        }
      });
    }
  }

  handleSearch() {
    const {
      searchQuery,
      topoiChips,
      stopTypeFilter,
      withoutLocationOnly,
      withDuplicateImportedIds,
      withNearbySimilarDuplicates,
      withTags,
      showFutureAndExpired,
      tags,
      filterByOrg
    } = this.state;
    const { client } = this.props;

    this.setState({
      isLoading: true
    });

    let optionalOrgCodeFilter = filterByOrg ? this.findOrgCodeFilter(filterByOrg) : null;

    const queryVariables = {
      query: searchQuery,
      withoutLocationOnly,
      withDuplicateImportedIds,
      pointInTime: (withDuplicateImportedIds || withNearbySimilarDuplicates || !showFutureAndExpired)
        ? new Date().toISOString()
        : null,
      stopPlaceType: stopTypeFilter,
      withNearbySimilarDuplicates,
      withTags,
      tags,
      municipalityReference: topoiChips
        .filter(topos => topos.type === 'municipality')
        .map(topos => topos.id),
      countyReference: topoiChips
        .filter(topos => topos.type === 'county')
        .map(topos => topos.id),
      code: optionalOrgCodeFilter
    };

    client
      .query({
        query: findStopForReport,
        fetchPolicy: 'network-only',
        variables: queryVariables
      })
      .then(response => {
        const stopPlaces = response.data.stopPlace;
        const stopPlaceIds = stopPlaces.map(stopPlace => stopPlace.id);
        buildReportSearchQuery({
          ...queryVariables,
          showFutureAndExpired
        });
        client
          .query({
            query: getParkingForMultipleStopPlaces(stopPlaceIds),
            reducer: reportReducer,
            fetchPolicy: 'network-only',
            operationName: 'multipleParkingQuery'
          })
          .then(response => {
            this.setState({
              isLoading: false,
              activePageIndex: 0
            });
          });
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
      });
  }

  handleDeleteChipById(chipId) {
    this.setState({
      topoiChips: this.state.topoiChips.filter(tc => tc.id !== chipId)
    });
  }

  handleAddChip(chip, index) {
    if (chip && index > -1) {
      let addedChipsIds = this.state.topoiChips.map(tc => tc.id);
      if (addedChipsIds.indexOf(chip.id) === -1) {
        this.setState({
          topoiChips: this.state.topoiChips.concat(chip)
        });
        this.refs.topoFilter.setState({
          searchText: ''
        });
      }
    }
  }

  handleTopographicalPlaceSearch(searchText) {
    this.props.client.query({
      query: topopGraphicalPlacesReportQuery,
      fetchPolicy: 'network-only',
      variables: {
        query: searchText
      }
    });
  }

  createTopographicPlaceMenuItem(place, formatMessage) {
    let name = this.getTopographicalNames(place);
    return {
      text: name,
      id: place.id,
      value: (
        <MenuItem
          primaryText={name}
          secondaryText={formatMessage({ id: place.topographicPlaceType })}
        />
      ),
      type: place.topographicPlaceType
    };
  }

  getTopographicalNames(topographicalPlace) {
    let name = topographicalPlace.name.value;

    if (
      topographicalPlace.topographicPlaceType === 'municipality' &&
      topographicalPlace.parentTopographicPlace
    ) {
      name += `, ${topographicalPlace.parentTopographicPlace.name.value}`;
    }
    return name;
  }

  findOrgCodeFilter() {
    const rolesToSearchIn = [ 'editStops', '' ];
    let orgCodeFilter = null;
    let userRoles = JSON.parse(this.props.code);

    let firstOrgFound = this.props.code.find(userRole => rolesToSearchIn.includes(userRole.o));

    if (firstOrgFound !== undefined) {
      userRoles = userRoles.o.toLowerCase();
      if (userRoles !== window.config.netexPrefix.toLowerCase()) {
        orgCodeFilter = userRoles;
      }
    }
    return orgCodeFilter;
  }

  render() {
    const {
      stopTypeFilter,
      topoiChips,
      activePageIndex,
      isLoading,
      withoutLocationOnly,
      withDuplicateImportedIds,
      withNearbySimilarDuplicates,
      showFutureAndExpired,
      withTags,
      filterByOrg
    } = this.state;
    const { intl, topographicalPlaces, results, duplicateInfo } = this.props;
    const { locale, formatMessage } = intl;

    const topographicalPlacesDataSource = topographicalPlaces
      .filter(
        place =>
          place.topographicPlaceType === 'county' ||
          place.topographicPlaceType === 'municipality'
      )
      .filter(
        place => topoiChips.map(chip => chip.value).indexOf(place.id) == -1
      )
      .map(place => this.createTopographicPlaceMenuItem(place, formatMessage));

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <ReportFilterBox style={{ width: '50%' }}>
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 5,
                  fontSize: 12,
                  padding: 5,
                  marginLeft: 5
                }}
              >
                {formatMessage({ id: 'filter_report_by_modality' })}
              </div>
              <ModalityFilter
                locale={locale}
                stopTypeFilter={stopTypeFilter}
                handleApplyFilters={filters =>
                  this.handleApplyModalityFilters(filters)}
              />
              <div style={{ padding: 5, marginLeft: 5 }}>
                <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 12 }}>
                  {formatMessage({ id: 'filter_report_by_topography' })}
                </div>
                <AutoComplete
                  hintText={formatMessage({ id: 'filter_by_topography' })}
                  dataSource={topographicalPlacesDataSource}
                  onUpdateInput={this.handleTopographicalPlaceSearch.bind(this)}
                  filter={AutoComplete.caseInsensitiveFilter}
                  style={{
                    margin: 'auto',
                    width: '50%',
                    textAlign: 'center',
                    marginTop: -10
                  }}
                  maxSearchResults={5}
                  fullWidth={true}
                  ref="topoFilter"
                  onNewRequest={this.handleAddChip.bind(this)}
                />
                <TopographicalFilter
                  topoiChips={topoiChips}
                  handleDeleteChip={chip => this.handleDeleteChipById(chip)}
                />
              </div>
            </ReportFilterBox>
            <ReportFilterBox style={{ width: '50%' }}>
              <div style={{ marginLeft: 5, paddingTop: 5 }}>
                <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 10 }}>{formatMessage({ id: 'filter_by_tags' })}</div>
                <TagFilterTray
                  tags={this.state.tags}
                  formatMessage={formatMessage}
                  handleItemOnCheck={this.handleItemOnCheck.bind(this)}
                />
              </div>
              <div
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <TextField
                  floatingLabelText={formatMessage({
                    id: 'optional_search_string'
                  })}
                  style={{ width: 330 }}
                  value={this.state.searchQuery}
                  onKeyDown={this.handleOnKeyDown.bind(this)}
                  onChange={(e, v) => {
                    this.handleSearchQueryChange(v);
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <RaisedButton
                    style={{ marginTop: 10, marginLeft: 5, transform: 'scale(0.9)' }}
                    disabled={isLoading}
                    icon={isLoading ? <MdSpinner /> : <MdSearch />}
                    label={formatMessage({ id: 'search' })}
                    onClick={() => this.handleSearch()}
                  />
                  <AdvancedReportFilters
                    formatMessage={formatMessage}
                    withoutLocationOnly={withoutLocationOnly}
                    withDuplicateImportedIds={withDuplicateImportedIds}
                    withNearbySimilarDuplicates={withNearbySimilarDuplicates}
                    showFutureAndExpired={showFutureAndExpired}
                    filterByOrg={filterByOrg}
                    withTags={withTags}
                    handleCheckboxChange={this.handleFilterChange.bind(this)}
                  />
                </div>
              </div>
            </ReportFilterBox>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <ColumnFilterPopover
            style={{ marginLeft: 2, marginTop: 5, transform: 'scale(0.9)' }}
            columnOptions={this.state.columnOptionsStopPlace}
            handleColumnCheck={this.handleColumnStopPlaceCheck.bind(this)}
            buttonLabel={formatMessage({
              id: 'column_filter_label_stop_place'
            })}
            captionLabel={formatMessage({ id: 'stop_place' })}
            locale={locale}
            handleCheckAll={this.handleCheckAllColumnStops.bind(this)}
            selectAllLabel={formatMessage({ id: 'all' })}
          />
          <ColumnFilterPopover
            style={{ marginLeft: 2, marginTop: 5, transform: 'scale(0.9)' }}
            columnOptions={this.state.columnOptionsQuays}
            handleColumnCheck={this.handleColumnQuaysCheck.bind(this)}
            buttonLabel={formatMessage({ id: 'column_filter_label_quays' })}
            captionLabel={formatMessage({ id: 'quays' })}
            locale={locale}
            handleCheckAll={this.handleCheckAllColumnQuays.bind(this)}
            selectAllLabel={formatMessage({ id: 'all' })}
          />
        </div>
        <ReportResultView
          activePageIndex={activePageIndex}
          intl={intl}
          results={results}
          stopPlaceColumnOptions={this.state.columnOptionsStopPlace}
          quaysColumnOptions={this.state.columnOptionsQuays}
          duplicateInfo={duplicateInfo}
        />
        <ReportPageFooter
          results={results}
          intl={intl}
          stopPlaceColumnOptions={this.state.columnOptionsStopPlace}
          quaysColumnOptions={this.state.columnOptionsQuays}
          handleSelectPage={this.handleSelectPage.bind(this)}
          activePageIndex={activePageIndex}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results,
  duplicateInfo: state.report.duplicateInfo,
  orgCode: state.user.searchFilters.orgCode,
  roles: state.roles.kc.tokenParsed.roles
});

export default withApollo(connect(mapStateToProps)(injectIntl(ReportPage)));
