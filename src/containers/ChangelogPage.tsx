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

import React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  findStopForReport,
  getStopPlaceVersions,
  getTopographicPlaces,
  topographicalPlaceSearch,
} from "../actions/TiamatActions";
import ChangelogPageComponent, {
  StopPlaceResult,
  StopPlaceVersion,
  TopoChip,
  VersionEntry,
} from "../components/ChangelogPage/ChangelogPage.tsx";
import {
  buildReportSearchQuery,
  extractQueryParamsFromUrl,
} from "../utils/URLhelpers";

interface ReduxProps {
  topographicalPlaces: any[];
  dispatch: Dispatch;
}

type Props = ReduxProps & WrappedComponentProps;

interface State {
  stopTypeFilter: string[];
  topoiChips: TopoChip[];
  searchQuery: string;
  topographicPlaceFilterValue: string;
  isLoading: boolean;
  results: StopPlaceResult[] | null;
  versionsMap: Record<string, VersionEntry>;
}

class ChangelogPage extends React.Component<Props, State> {
  private _topoSearchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      stopTypeFilter: [],
      topoiChips: [],
      searchQuery: "",
      topographicPlaceFilterValue: "",
      isLoading: false,
      results: null,
      versionsMap: {},
    };
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;
    const { formatMessage } = intl;
    const fromURL = extractQueryParamsFromUrl();

    // Restore scalar filters from URL
    this.setState({
      searchQuery: fromURL.query || "",
      stopTypeFilter: fromURL.stopPlaceType
        ? fromURL.stopPlaceType.split(",")
        : [],
    });

    // Restore topographical chips from URL by fetching their display names
    const topoIds: string[] = [];
    if (fromURL.municipalityReference) {
      topoIds.push(...fromURL.municipalityReference.split(","));
    }
    if (fromURL.countyReference) {
      topoIds.push(...fromURL.countyReference.split(","));
    }
    if (fromURL.countryReference) {
      topoIds.push(...fromURL.countryReference.split(","));
    }

    if (topoIds.length > 0) {
      (dispatch as any)(getTopographicPlaces(topoIds)).then((response: any) => {
        if (response.data && Object.keys(response.data).length) {
          const menuItems: TopoChip[] = [];
          Object.keys(response.data).forEach((key) => {
            const place = response.data[key]?.length
              ? response.data[key][0]
              : null;
            if (place) {
              menuItems.push(
                this.createTopographicPlaceMenuItem(place, formatMessage),
              );
            }
          });
          this.setState({ topoiChips: menuItems });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this._topoSearchTimer) clearTimeout(this._topoSearchTimer);
  }

  private createTopographicPlaceMenuItem(
    place: any,
    formatMessage: (descriptor: { id: string }) => string,
  ): TopoChip {
    let name: string = place.name.value;
    if (
      place.topographicPlaceType === "municipality" &&
      place.parentTopographicPlace
    ) {
      name += `, ${place.parentTopographicPlace.name.value}`;
    }
    return {
      text: name,
      id: place.id,
      value: (
        <div
          style={{
            marginLeft: 10,
            display: "flex",
            flexDirection: "column",
            minWidth: 380,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.9em" }}>{name}</div>
            <div style={{ fontSize: "0.6em", color: "grey" }}>
              {formatMessage({ id: place.topographicPlaceType })}
            </div>
          </div>
        </div>
      ),
      type: place.topographicPlaceType,
    };
  }

  handleApplyModalityFilters(filters: string[]) {
    this.setState({ stopTypeFilter: filters });
  }

  handleSearchQueryChange(searchQuery: string) {
    this.setState({ searchQuery });
  }

  handleTopographicalPlaceSearch(
    _event: React.SyntheticEvent,
    searchText: string,
    reason: string,
  ) {
    if (reason === "reset") {
      if (this._topoSearchTimer) clearTimeout(this._topoSearchTimer);
      this.setState({ topographicPlaceFilterValue: "" });
      return;
    }
    this.setState({ topographicPlaceFilterValue: searchText });
    if (this._topoSearchTimer) clearTimeout(this._topoSearchTimer);
    if (searchText) {
      this._topoSearchTimer = setTimeout(() => {
        (this.props.dispatch as any)(topographicalPlaceSearch(searchText));
      }, 300);
    }
  }

  handleAddChip(_event: React.SyntheticEvent, chip: TopoChip | null) {
    if (!chip) return;
    const addedIds = this.state.topoiChips.map((tc) => tc.id);
    if (!addedIds.includes(chip.id)) {
      this.setState({
        topoiChips: [...this.state.topoiChips, chip],
        topographicPlaceFilterValue: "",
      });
    }
  }

  handleDeleteChipById(chipId: string) {
    this.setState({
      topoiChips: this.state.topoiChips.filter((tc) => tc.id !== chipId),
    });
  }

  handleSearch() {
    const { searchQuery, topoiChips, stopTypeFilter } = this.state;
    const { dispatch } = this.props;

    this.setState({ isLoading: true, results: null, versionsMap: {} });

    const municipalityReference = topoiChips
      .filter((t) => t.type === "municipality")
      .map((t) => t.id);
    const countyReference = topoiChips
      .filter((t) => t.type === "county")
      .map((t) => t.id);
    const countryReference = topoiChips
      .filter((t) => t.type === "country")
      .map((t) => t.id);

    const queryVariables = {
      query: searchQuery,
      withoutLocationOnly: false,
      withDuplicateImportedIds: false,
      stopPlaceType: stopTypeFilter,
      withNearbySimilarDuplicates: false,
      hasParking: false,
      withTags: false,
      tags: [],
      versionValidity: "MAX_VERSION",
      pointInTime: null,
      municipalityReference,
      countyReference,
      countryReference,
    };

    // Persist filters to URL so the search is bookmarkable and survives refresh
    buildReportSearchQuery({
      query: searchQuery,
      stopPlaceType: stopTypeFilter,
      municipalityReference,
      countyReference,
      countryReference,
    });

    (dispatch as any)(findStopForReport(queryVariables))
      .then((response: any) => {
        const stops: StopPlaceResult[] = (response.data.stopPlace || [])
          .slice()
          .sort((a: StopPlaceResult, b: StopPlaceResult) => {
            const aDate = a.validBetween?.fromDate ?? "";
            const bDate = b.validBetween?.fromDate ?? "";
            return bDate.localeCompare(aDate);
          });
        this.setState({ isLoading: false, results: stops });
      })
      .catch(() => {
        this.setState({ isLoading: false, results: [] });
      });
  }

  async handleToggleVersions(stopId: string) {
    const { versionsMap } = this.state;
    const existing = versionsMap[stopId];

    // Already loaded — toggle collapse
    if (existing?.versions) {
      this.setState({
        versionsMap: {
          ...versionsMap,
          [stopId]: { ...existing, collapsed: !existing.collapsed },
        },
      });
      return;
    }

    this.setState({
      versionsMap: {
        ...versionsMap,
        [stopId]: { loading: true, versions: null, collapsed: false },
      },
    });

    try {
      const result: any = await (this.props.dispatch as any)(
        getStopPlaceVersions(stopId),
      );
      const versions: StopPlaceVersion[] = (result?.data?.versions ?? [])
        .slice()
        .sort(
          (a: StopPlaceVersion, b: StopPlaceVersion) => b.version - a.version,
        );
      this.setState({
        versionsMap: {
          ...this.state.versionsMap,
          [stopId]: { loading: false, versions, collapsed: false },
        },
      });
    } catch {
      this.setState({
        versionsMap: {
          ...this.state.versionsMap,
          [stopId]: { loading: false, versions: [], collapsed: false },
        },
      });
    }
  }

  render() {
    const {
      stopTypeFilter,
      topoiChips,
      topographicPlaceFilterValue,
      searchQuery,
      isLoading,
      results,
      versionsMap,
    } = this.state;
    const { intl, topographicalPlaces } = this.props;
    const { formatMessage } = intl;

    const topographicalPlacesDataSource: TopoChip[] = topographicalPlaces
      .filter(
        (p) =>
          p.topographicPlaceType === "county" ||
          p.topographicPlaceType === "municipality" ||
          p.topographicPlaceType === "country",
      )
      .filter((p) => !topoiChips.some((c) => c.id === p.id))
      .map((p) => this.createTopographicPlaceMenuItem(p, formatMessage));

    return (
      <ChangelogPageComponent
        stopTypeFilter={stopTypeFilter}
        topoiChips={topoiChips}
        topographicPlaceFilterValue={topographicPlaceFilterValue}
        topographicalPlacesDataSource={topographicalPlacesDataSource}
        searchQuery={searchQuery}
        isLoading={isLoading}
        results={results}
        versionsMap={versionsMap}
        onApplyModalityFilters={(f) => this.handleApplyModalityFilters(f)}
        onSearchQueryChange={(q) => this.handleSearchQueryChange(q)}
        onTopographicalPlaceSearch={(e, t, r) =>
          this.handleTopographicalPlaceSearch(e, t, r)
        }
        onAddChip={(e, chip) => this.handleAddChip(e, chip)}
        onDeleteChip={(id) => this.handleDeleteChipById(id)}
        onSearch={() => this.handleSearch()}
        onToggleVersions={(id) => this.handleToggleVersions(id)}
      />
    );
  }
}

const mapStateToProps = (state: any) => ({
  topographicalPlaces: state.report.topographicalPlaces,
});

export default injectIntl(connect(mapStateToProps)(ChangelogPage));
