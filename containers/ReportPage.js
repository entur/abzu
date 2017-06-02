import React from 'react'
import { connect } from 'react-redux'
import ReportPageFooter from '../components/ReportPageFooter'
import ReportResultView from '../components/ReportResultView'
import ReportFilterBox from '../components/ReportFilterBox'
import ModalityFilter from '../components/ModalityFilter'
import TopographicalFilter from '../components/TopographicalFilter'
import AutoComplete from 'material-ui/AutoComplete'
import { withApollo } from 'react-apollo'
import { topopGraphicalPlacesReportQuery, findStopForReport } from '../graphql/Queries'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MdSpinner from '../static/icons/spinner'
import MdSearch from 'material-ui/svg-icons/action/search'
import ColumnFilterPopover from '../components/ColumnFilterPopover'

import { injectIntl } from 'react-intl'

class ReportPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stopTypeFilter: [],
      quayMin: 0,
      quayMax: 10,
      topoiChips: [],
      activePageIndex: 0,
      searchQuery: '',
      isLoading: false,
      columnOptions: [
        {
          id: "id",
          checked: true,
        },
        {
          id: "name",
          checked: true,
        },
        {
          id: "modality",
          checked: true,
        },
        {
          id: "county",
          checked: true,
        },
        {
          id: "muncipality",
          checked: true,
        },
        {
          id: "importedId",
          checked: true,
        },
        {
          id: "position",
          checked: true,
        },
        {
          id: "quays",
          checked: false,
        },
      ]
    }
  }

  handleSelectPage(pageIndex) {
    this.setState({
      activePageIndex: pageIndex
    })
  }

  handleColumnCheck(id, checked) {

    const columnOptions = this.state.columnOptions.slice()

    for (let i = 0; columnOptions.length > i; i++) {
      let option = columnOptions[i]
      if (option.id === id) {
        option.checked = checked
        columnOptions[i] = option
        break
      }
    }

    this.setState({
      columnOptions: columnOptions
    })
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl
    document.title = formatMessage({id: '_report_page'})
  }

  handleSearch() {
    const { searchQuery, topoiChips, stopTypeFilter } = this.state

    this.setState({
      isLoading: true
    })

    this.props.client.query({
      query: findStopForReport,
      fetchPolicy: 'network-only',
      variables: {
        query: searchQuery,
        stopPlaceType: stopTypeFilter,
        municipalityReference: topoiChips
          .filter( topos => topos.type === "town").map(topos => topos.id),
        countyReference: topoiChips
          .filter( topos => topos.type === "county").map(topos => topos.id)
      }
    }).then( response => {
      this.setState({
        isLoading: false
      })
    }).catch( err => {
      this.setState({
        isLoading: false
      })
    })
  }

  handleDeleteChipById(chipId) {
    this.setState({
      topoiChips: this.state.topoiChips.filter( tc => tc.id  !== chipId)
    })
  }

  handleAddChip(chip) {

    let addedChipsIds = this.state.topoiChips.map( tc => tc.id )

    if (addedChipsIds.indexOf(chip.id) === -1) {
      this.setState({
        topoiChips: this.state.topoiChips.concat(chip)
      })
    }
  }

  handleTopographicalPlaceSearch(searchText) {
    this.props.client.query({
      query: topopGraphicalPlacesReportQuery,
      fetchPolicy: 'network-only',
      variables: {
        query: searchText
      }
    })
  }

  getTopographicalNames(topographicalPlace) {
    let name = topographicalPlace.name.value

    if (topographicalPlace.topographicPlaceType === 'town' && topographicalPlace.parentTopographicPlace) {
      name += `, ${topographicalPlace.parentTopographicPlace.name.value}`
    }
    return name
  }

  render() {

    const { stopTypeFilter, quayMin, quayMax, topoiChips, activePageIndex, isLoading } = this.state
    const { intl, topographicalPlaces, results } = this.props
    const { locale, formatMessage } = intl

    const topographicalPlacesDataSource = topographicalPlaces
      .filter( place => place.topographicPlaceType === "county" || place.topographicPlaceType === "town")
      .filter( place => topoiChips.map( chip => chip.value ).indexOf(place.id) == -1)
      .map( place => {
        let name = this.getTopographicalNames(place)
        return {
          text: name,
          id: place.id,
          value: (
            <MenuItem
              primaryText={name}
              secondaryText={ formatMessage({id: place.topographicPlaceType}) }
            />
          ),
          type: place.topographicPlaceType
        }
      })

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex'}}>
            <ReportFilterBox style={{width: '50%'}}>
              <div style={{fontWeight: 600, marginBottom: 5, fontSize: 12, padding: 5, marginLeft: 5}}>
                Filtrer på modalitet
              </div>
              <ModalityFilter
                locale={locale}
                stopTypeFilter={stopTypeFilter}
                handleApplyFilters={ filters => this.setState({stopTypeFilter: filters})}
              />
              <div style={{padding: 5, marginLeft: 5}}>
                <div style={{fontWeight: 600, marginBottom: 5, fontSize: 12}}>
                  Filtrer på fylker og kommuner
                </div>
                <AutoComplete
                  hintText={formatMessage({id: "filter_by_topography"})}
                  dataSource={topographicalPlacesDataSource}
                  onUpdateInput={this.handleTopographicalPlaceSearch.bind(this)}
                  filter={AutoComplete.caseInsensitiveFilter}
                  style={{margin: 'auto', width: '50%', textAlign: 'center', marginTop: -10}}
                  maxSearchResults={5}
                  fullWidth={true}
                  ref="topoFilter"
                  onNewRequest={this.handleAddChip.bind(this)}
                />
                <TopographicalFilter
                  topoiChips={topoiChips}
                  handleDeleteChip={ chip => this.handleDeleteChipById(chip) }
                />
              </div>
            </ReportFilterBox>
            <ReportFilterBox style={{width: '50%'}}>
              <div style={{fontWeight: 600, marginBottom: 5, fontSize: 12, padding: 5, marginLeft: 5}}>
                Øvrige filtre
              </div>
              <div style={{display: 'flex', alignItems: 'center', padding: 5}}>
                <div style={{marginLeft: 5, marginRight: 5, fontSize: 12}}>Quays</div>
                <input value={quayMin} min="0" style={{flex: 2, lineHeight: '20px'}} type="number"></input>
                <div style={{marginLeft: 5, marginRight: 5, fontSize: 12}}>to</div>
                <input value={quayMax}  min="0" style={{flex: 2, lineHeight: '20px'}} type="number"></input>
              </div>
              <div style={{marginLeft: 10, display: 'flex', alignItems: 'center'}}>
                <TextField
                  floatingLabelText={"Optional search string"}
                  value={this.state.searchQuery}
                  onChange={(e, v) => this.setState({searchQuery: v})}
                />
                <RaisedButton
                  style={{marginTop: 10, marginLeft: 5}}
                  disabled={isLoading}
                  icon={isLoading ?
                    <MdSpinner style={{marginTop: -5, marginLeft: -5}}/>
                    : <MdSearch/>}
                  label={"Search"}
                  onClick={ () => this.handleSearch() }
                />
              </div>
            </ReportFilterBox>
          </div>
        </div>
        <ColumnFilterPopover
          style={{marginLeft: 5, marginTop: 5}}
          columnOptions={this.state.columnOptions}
          handleColumnCheck={this.handleColumnCheck.bind(this)}
        />
        <ReportResultView
          activePageIndex={activePageIndex}
          results={results}
          columnOptions={this.state.columnOptions}
        />
        <ReportPageFooter
          results={results}
          columnOptions={this.state.columnOptions}
          handleSelectPage={this.handleSelectPage.bind(this)}
          activePageIndex={activePageIndex}
        />
      </div>
    )
  }
}


const mapStateToProps = state => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results
})

export default withApollo(connect(mapStateToProps)((injectIntl(ReportPage))))