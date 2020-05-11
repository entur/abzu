/* eslint-disable */

import React, { useState } from "react";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";
import { injectIntl } from "react-intl";
import { Box, TextField, Button, Container } from "@material-ui/core";
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
import ReportResultView from "../components/ReportPage/ReportResultView";
import {
  columnOptionsQuays,
  columnOptionsStopPlace,
} from "../config/columnOptions";
import ColumnFilterPopover from "../components/EditStopPage/ColumnFilterPopover";

const updateColumnOption = (selected, options) => {
  return options.map((opt) => {
    if (opt.id === selected.id) {
      opt.checked = selected.checked;
    }
    return opt;
  });
};

const updateAllOption = (checked, options) => {
  return options.map((opt) => {
    opt.checked = checked;
    return opt;
  });
};

const ReportPageV2 = ({ intl, client, results, duplicateInfo }) => {
  const { formatMessage } = intl;
  const [searchQuery, setSearchQuery] = useState("");
  const [stopTypeFilter, setStopTypeFilter] = useState([]);

  const [stopPlaceColumns, setStopPlaceColumns] = useState(
    columnOptionsStopPlace
  );
  const [quayColumns, setQuayColumns] = useState(columnOptionsQuays);

  const topoiChips = [];
  const activePageIndex = 0;

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

  return (
    <Container>
      <Box>
        <TextField
          label="Optional search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Box>
        <StopTypeFilter value={stopTypeFilter} onChange={setStopTypeFilter} />
      </Box>
      <Box>
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box>
        <div style={{ display: "flex" }}>
          <ColumnFilterPopover
            style={{ marginLeft: 2, marginTop: 5, transform: "scale(0.9)" }}
            columnOptions={stopPlaceColumns}
            handleColumnCheck={(id, checked) =>
              setStopPlaceColumns(
                updateColumnOption({ id, checked }, stopPlaceColumns)
              )
            }
            buttonLabel={formatMessage({
              id: "column_filter_label_stop_place",
            })}
            captionLabel={formatMessage({ id: "stop_place" })}
            formatMessage={formatMessage}
            handleCheckAll={(checked) =>
              setStopPlaceColumns(updateAllOption(checked, stopPlaceColumns))
            }
            selectAllLabel={formatMessage({ id: "all" })}
          />
          <ColumnFilterPopover
            style={{ marginLeft: 2, marginTop: 5, transform: "scale(0.9)" }}
            columnOptions={quayColumns}
            handleColumnCheck={(id, checked) =>
              setQuayColumns(updateColumnOption({ id, checked }, quayColumns))
            }
            buttonLabel={formatMessage({ id: "column_filter_label_quays" })}
            captionLabel={formatMessage({ id: "quays" })}
            formatMessage={formatMessage}
            handleCheckAll={(checked) =>
              setQuayColumns(updateAllOption(checked, quayColumns))
            }
            selectAllLabel={formatMessage({ id: "all" })}
          />
        </div>
        <ReportResultView
          results={results}
          intl={intl}
          stopPlaceColumnOptions={stopPlaceColumns}
          activePageIndex={activePageIndex}
          quaysColumnOptions={quayColumns}
          duplicateInfo={duplicateInfo}
        />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results,
  duplicateInfo: state.report.duplicateInfo,
});

export default withApollo(connect(mapStateToProps)(injectIntl(ReportPageV2)));
