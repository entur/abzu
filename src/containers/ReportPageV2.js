import React, { useState } from "react";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import StopTypeFilter from "../components/ReportPageV2/StopTypeFilter";
import {
  buildReportSearchQuery,
  extractQueryParamsFromUrl,
} from "../utils/URLhelpers";
import {
  findStopForReport,
  getParkingForMultipleStopPlaces,
  topopGraphicalPlacesReportQuery,
} from "../graphql/Tiamat/queries";
import { reportReducer } from "../reducers/";

const ReportPageV2 = ({ intl: { formatMessage }, client, results }) => {
  const [stopTypeFilter, setStopTypeFilter] = useState([]);
  const topoiChips = [];
  const activePageIndex = 0;
  const searchQuery = "";
  const isLoading = false;
  const withoutLocationOnly = false;
  const withDuplicateImportedIds = false;
  const withNearbySimilarDuplicates = false;
  const hasParking = false;
  const showFutureAndExpired = false;
  const withTags = false;
  const tags = [];

  const handleSearch = async () => {
    const queryVariables = {
      query: searchQuery,
      withoutLocationOnly,
      withDuplicateImportedIds,
      pointInTime:
        withDuplicateImportedIds ||
        withNearbySimilarDuplicates ||
        !showFutureAndExpired
          ? new Date().toISOString()
          : null,
      stopPlaceType: stopTypeFilter,
      withNearbySimilarDuplicates,
      hasParking,
      withTags,
      tags,
      versionValidity: showFutureAndExpired ? "MAX_VERSION" : null,
      municipalityReference: topoiChips
        .filter((topos) => topos.type === "municipality")
        .map((topos) => topos.id),
      countyReference: topoiChips
        .filter((topos) => topos.type === "county")
        .map((topos) => topos.id),
      countryReference: topoiChips
        .filter((topos) => topos.type === "country")
        .map((topos) => topos.id),
    };

    const stopPlaceResponse = await client.query({
      query: findStopForReport,
      fetchPolicy: "network-only",
      variables: queryVariables,
    });

    const stopPlaces = stopPlaceResponse.data.stopPlace;
    const stopPlaceIds = [];
    for (let i = 0; i < stopPlaces.length; i++) {
      if (stopPlaces[i].__typename == "ParentStopPlace") {
        const childStops = stopPlaces[i].children;
        for (let j = 0; j < childStops.length; j++) {
          stopPlaceIds.push(childStops[j].id);
        }
      } else {
        stopPlaceIds.push(stopPlaces[i].id);
      }
    }

    buildReportSearchQuery({
      ...queryVariables,
      showFutureAndExpired,
    });

    const parkingResponse = await client.query({
      query: getParkingForMultipleStopPlaces(stopPlaceIds),
      reducer: reportReducer,
      fetchPolicy: "network-only",
      operationName: "multipleParkingQuery",
    });

    // this.setState({
    //     isLoading: false,
    //     activePageIndex: 0
    // });

    // .catch(err => {
    // this.setState({
    //     isLoading: false
    // });
    // });
  };

  console.log(results);

  return (
    <div>
      <h1>Reports V2</h1>
      <StopTypeFilter value={stopTypeFilter} onChange={setStopTypeFilter} />
      <Button variant="outlined" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results,
  duplicateInfo: state.report.duplicateInfo,
});

export default withApollo(connect(mapStateToProps)(injectIntl(ReportPageV2)));
