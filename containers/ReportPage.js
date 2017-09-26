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
import Checkbox from 'material-ui/Checkbox';
import {
  topopGraphicalPlacesReportQuery,
  findStopForReport
} from '../graphql/Queries';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MdSpinner from '../static/icons/spinner';
import MdSearch from 'material-ui/svg-icons/action/search';
import ColumnFilterPopover from '../components/EditStopPage/ColumnFilterPopover';
import { getParkingForMultipleStopPlaces } from '../graphql/Queries';
import { reportReducer } from '../reducers/';
import { injectIntl } from 'react-intl';
import {
  columnOptionsQuays,
  columnOptionsStopPlace
} from '../config/columnOptions';

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

  handleCheckAllColumnStops() {
    this.setState({
      columnOptionsStopPlace: columnOptionsStopPlace.map(option => ({
        ...option,
        checked: true
      }))
    });
  }

  handleColumnStopPlaceCheck(id, checked) {
    const columnOptions = this.state.columnOptionsStopPlace.slice();

    for (let i = 0; columnOptions.length > i; i++) {
      let option = columnOptions[i];
      if (option.id === id) {
        option.checked = checked;
        columnOptions[i] = option;
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
      let option = columnOptions[i];
      if (option.id === id) {
        option.checked = checked;
        columnOptions[i] = option;
        break;
      }
    }

    this.setState({
      columnOptionsQuays: columnOptions
    });
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl;
    document.title = formatMessage({ id: '_report_page' });
  }

  handleSearch() {
    const { searchQuery, topoiChips, stopTypeFilter, withoutLocationOnly, withDuplicateImportedIds } = this.state;
    const { client } = this.props;

    this.setState({
      isLoading: true
    });

    client
      .query({
        query: findStopForReport,
        fetchPolicy: 'network-only',
        variables: {
          query: searchQuery,
          withoutLocationOnly,
          withDuplicateImportedIds,
          stopPlaceType: stopTypeFilter,
          municipalityReference: topoiChips
            .filter(topos => topos.type === 'town')
            .map(topos => topos.id),
          countyReference: topoiChips
            .filter(topos => topos.type === 'county')
            .map(topos => topos.id)
        }
      })
      .then(response => {
        const stopPlaces = response.data.stopPlace;
        const stopPlaceIds = stopPlaces.map(stopPlace => stopPlace.id);

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
              activePageIndex: 0,
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

  handleAddChip(chip) {
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

  handleTopographicalPlaceSearch(searchText) {
    this.props.client.query({
      query: topopGraphicalPlacesReportQuery,
      fetchPolicy: 'network-only',
      variables: {
        query: searchText
      }
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

  render() {
    const {
      stopTypeFilter,
      topoiChips,
      activePageIndex,
      isLoading,
      withoutLocationOnly,
      withDuplicateImportedIds
    } = this.state;
    const { intl, topographicalPlaces, results, duplicateInfo } = this.props;
    const { locale, formatMessage } = intl;

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
              secondaryText={formatMessage({ id: place.topographicPlaceType })}
            />
          ),
          type: place.topographicPlaceType
        };
      });

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
                  this.setState({ stopTypeFilter: filters })}
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
              <div style={{marginLeft: 10, marginTop: 10}}>
                <Checkbox
                  label={formatMessage({id: 'only_without_coordinates'})}
                  labelPosition="left"
                  labelStyle={{width: 'auto', fontSize: '0.9em'}}
                  checked={withoutLocationOnly}
                  onCheck={ (e, value) => { this.setState({withoutLocationOnly: value})}}
                />
                <Checkbox
                  label={formatMessage({id: 'only_duplicate_importedIds'})}
                  labelPosition="left"
                  labelStyle={{width: 'auto', fontSize: '0.9em'}}
                  checked={withDuplicateImportedIds}
                  onCheck={ (e, value) => { this.setState({withDuplicateImportedIds: value})}}
                  style={{marginTop: 10}}
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
                  value={this.state.searchQuery}
                  onKeyDown={this.handleOnKeyDown.bind(this)}
                  onChange={(e, v) => this.setState({ searchQuery: v })}
                />
                <RaisedButton
                  style={{ marginTop: 10, marginLeft: 5 }}
                  disabled={isLoading}
                  icon={
                    isLoading
                      ? <MdSpinner style={{ marginTop: -5, marginLeft: -5 }} />
                      : <MdSearch />
                  }
                  label={formatMessage({ id: 'search' })}
                  onClick={() => this.handleSearch()}
                />
              </div>
            </ReportFilterBox>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <ColumnFilterPopover
            style={{ marginLeft: 5, marginTop: 5 }}
            columnOptions={this.state.columnOptionsStopPlace}
            handleColumnCheck={this.handleColumnStopPlaceCheck.bind(this)}
            buttonLabel={formatMessage({
              id: 'column_filter_label_stop_place'
            })}
            captionLabel={formatMessage({ id: 'stop_place' })}
            locale={locale}
            handleCheckAll={this.handleCheckAllColumnStops.bind(this)}
            selectAllLabel={formatMessage({id: 'all'})}
          />
          <ColumnFilterPopover
            style={{ marginLeft: 5, marginTop: 5 }}
            columnOptions={this.state.columnOptionsQuays}
            handleColumnCheck={this.handleColumnQuaysCheck.bind(this)}
            buttonLabel={formatMessage({ id: 'column_filter_label_quays' })}
            captionLabel={formatMessage({ id: 'quays' })}
            locale={locale}
            handleCheckAll={this.handleCheckAllColumnQuays.bind(this)}
            selectAllLabel={formatMessage({id: 'all'})}
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
});

export default withApollo(connect(mapStateToProps)(injectIntl(ReportPage)));
