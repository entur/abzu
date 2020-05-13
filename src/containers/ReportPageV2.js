/* eslint-disable */

import React, { useState } from "react";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";
import { injectIntl } from "react-intl";
import {
  Box,
  TextField,
  Button,
  Container,
  LinearProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
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
import TagFilterTray from "../components/ReportPage/TagFilterTray";
import ReportPageFooter from "../components/ReportPage/ReportPageFooter";

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

const handleTagItemCheck = ({ name, checked }, tags) => {
  let nextTags = tags.slice();
  if (checked) {
    nextTags.push(name);
  } else {
    nextTags = nextTags.filter((tag) => tag !== name);
  }
  return nextTags;
};

const ReportPageV2 = ({ intl, client, results, duplicateInfo }) => {
  const { formatMessage } = intl;
  const [searchQuery, setSearchQuery] = useState("");
  const [stopTypeFilter, setStopTypeFilter] = useState([]);

  const [stopPlaceColumns, setStopPlaceColumns] = useState(
    columnOptionsStopPlace
  );
  const [quayColumns, setQuayColumns] = useState(columnOptionsQuays);
  const [tags, setTags] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const topoiChips = [];

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const withoutLocationOnly = false;
  const withDuplicateImportedIds = false;
  const withNearbySimilarDuplicates = false;
  const hasParking = false;
  const showFutureAndExpired = false;
  const withTags = false;

  const handleSearch = async () => {
    setLoading(true);

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

    try {
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

      await client.query({
        query: getParkingForMultipleStopPlaces(stopPlaceIds),
        reducer: reportReducer,
        fetchPolicy: "network-only",
        operationName: "multipleParkingQuery",
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Box display="flex" alignItems="baseline" m={2}>
          <StopTypeFilter value={stopTypeFilter} onChange={setStopTypeFilter} />
          <TagFilterTray
            tags={tags}
            formatMessage={formatMessage}
            handleItemOnCheck={(name, checked) =>
              setTags(handleTagItemCheck({ name, checked }, tags))
            }
          />
        </Box>
        <Box display="flex" m={2}>
          <TextField
            label="Optional search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Box m={2}>
          <Button variant="outlined" onClick={handleSearch}>
            Search
          </Button>
        </Box>
        <Box m={1} display="flex">
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
        </Box>
        <Box mx={1} my={4}>
          {isLoading ? (
            <LinearProgress />
          ) : (
            !error && (
              <ReportResultView
                results={results}
                intl={intl}
                stopPlaceColumnOptions={stopPlaceColumns}
                activePageIndex={activePageIndex}
                quaysColumnOptions={quayColumns}
                duplicateInfo={duplicateInfo}
              />
            )
          )}
          {error && <Alert severity="error">{error.message}</Alert>}
        </Box>
      </Container>
      <ReportPageFooter
        results={results}
        intl={intl}
        stopPlaceColumnOptions={stopPlaceColumns}
        quaysColumnOptions={quayColumns}
        handleSelectPage={setActivePageIndex}
        activePageIndex={activePageIndex}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results,
  duplicateInfo: state.report.duplicateInfo,
});

export default withApollo(connect(mapStateToProps)(injectIntl(ReportPageV2)));
