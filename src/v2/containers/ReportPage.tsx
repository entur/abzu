import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import React, {
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";
import {
  findStopForReport,
  getParkingForMultipleStopPlaces,
  getTopographicPlaces,
  topographicalPlaceSearch,
} from "../../actions/TiamatActions";
import ReportPageFooter from "../../components/ReportPage/ReportPageFooter";
import ReportResultView from "../../components/ReportPage/ReportResultView";
import {
  columnOptionsQuays as initialColumnOptionsQuays,
  columnOptionsStopPlace as initialColumnOptionsStopPlace,
} from "../../config/columnOptions";
import {
  buildReportSearchQuery,
  extractQueryParamsFromUrl,
} from "../../utils/URLhelpers";
import { useSearch } from "../components/SearchContext";

import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import ColumnFilterPopover from "../../components/EditStopPage/ColumnFilterPopover";
import FilterDrawer from "./ReportFilterDrawer";

interface Props extends WrappedComponentProps {
  topographicalPlaces: any[];
  results: any[];
  duplicateInfo: any;
  dispatch: any;
}

const ReportPage: React.FC<Props> = ({
  intl,
  topographicalPlaces,
  results: dataSource,
  duplicateInfo,
  dispatch,
}) => {
  const { formatMessage, locale } = intl;

  const [stopTypeFilter, setStopTypeFilter] = useState<string[]>([]);
  const [topoiChips, setTopoiChips] = useState<any[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [topographicPlaceFilterValue, setTopographicPlaceFilterValue] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [columnOptionsQuays, setColumnOptionsQuays] = useState(
    initialColumnOptionsQuays,
  );
  const [columnOptionsStopPlace, setColumnOptionsStopPlace] = useState(
    initialColumnOptionsStopPlace,
  );
  const [withoutLocationOnly, setWithoutLocationOnly] =
    useState<boolean>(false);
  const [withDuplicateImportedIds, setWithDuplicateImportedIds] =
    useState<boolean>(false);
  const [withNearbySimilarDuplicates, setWithNearbySimilarDuplicates] =
    useState<boolean>(false);
  const [hasParking, setHasParking] = useState<boolean>(false);
  const [showFutureAndExpired, setShowFutureAndExpired] =
    useState<boolean>(false);
  const [withTags, setWithTags] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fromURL = extractQueryParamsFromUrl();
    setSearchQuery(fromURL.query || "");
    setWithoutLocationOnly(fromURL.withoutLocationOnly === "true");
    setWithNearbySimilarDuplicates(
      fromURL.withNearbySimilarDuplicates === "true",
    );
    setHasParking(fromURL.hasParking === "true");
    setWithDuplicateImportedIds(fromURL.withDuplicateImportedIds === "true");
    setShowFutureAndExpired(fromURL.showFutureAndExpired === "true");
    setWithTags(fromURL.withTags === "true");
    setTags(fromURL.tags ? fromURL.tags.split(",") : []);
    setStopTypeFilter(
      fromURL.stopPlaceType ? fromURL.stopPlaceType.split(",") : [],
    );

    let topographicalPlaceIds: string[] = [];
    if (fromURL.municipalityReference) {
      topographicalPlaceIds = topographicalPlaceIds.concat(
        fromURL.municipalityReference.split(","),
      );
    }
    if (fromURL.countyReference) {
      topographicalPlaceIds = topographicalPlaceIds.concat(
        fromURL.countyReference.split(","),
      );
    }

    if (topographicalPlaceIds.length) {
      dispatch(getTopographicPlaces(topographicalPlaceIds)).then(
        (response: any) => {
          if (response.data && Object.keys(response.data).length) {
            const menuItems: any[] = [];
            Object.keys(response.data).forEach((result) => {
              const place =
                response.data[result] && response.data[result].length
                  ? response.data[result][0]
                  : null;
              if (place) {
                const menuItem = createTopographicPlaceMenuItem(
                  place,
                  formatMessage,
                );
                menuItems.push(menuItem);
              }
            });
            setTopoiChips(menuItems);
          }
        },
      );
    }
  }, [dispatch, formatMessage]);

  const handleSelectPage = (pageIndex: number) => setActivePageIndex(pageIndex);
  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleCheckAllColumnQuays = () => {
    setColumnOptionsQuays(
      initialColumnOptionsQuays.map((option) => ({ ...option, checked: true })),
    );
  };
  const handleApplyModalityFilters = (filters: any[]) =>
    setStopTypeFilter(filters);
  const handleSearchQueryChange = (query: string) => setSearchQuery(query);
  const handleItemOnCheck = (name: string, checked: boolean) => {
    setTags((prev) =>
      checked ? [...prev, name] : prev.filter((tag) => tag !== name),
    );
  };
  const handleCheckAllColumnStops = () => {
    setColumnOptionsStopPlace(
      initialColumnOptionsStopPlace.map((option) => ({
        ...option,
        checked: true,
      })),
    );
  };
  const handleFilterChange = (key: string, value: any) => {
    switch (key) {
      case "withoutLocationOnly":
        setWithoutLocationOnly(value);
        break;
      case "withDuplicateImportedIds":
        setWithDuplicateImportedIds(value);
        break;
      case "withNearbySimilarDuplicates":
        setWithNearbySimilarDuplicates(value);
        break;
      case "hasParking":
        setHasParking(value);
        break;
      case "showFutureAndExpired":
        setShowFutureAndExpired(value);
        break;
      case "withTags":
        setWithTags(value);
        break;
      default:
        break;
    }
  };
  const handleColumnStopPlaceCheck = (id: string, checked: boolean) => {
    setColumnOptionsStopPlace((prev) =>
      prev.map((option: any) =>
        option.id === id ? { ...option, checked } : option,
      ),
    );
  };
  const handleColumnQuaysCheck = (id: string, checked: boolean) => {
    setColumnOptionsQuays((prev) =>
      prev.map((option: any) =>
        option.id === id ? { ...option, checked } : option,
      ),
    );
  };

  const handleSearch = () => {
    setIsLoading(true);
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
        .filter((topos: any) => topos.type === "municipality")
        .map((topos: any) => topos.id),
      countyReference: topoiChips
        .filter((topos: any) => topos.type === "county")
        .map((topos: any) => topos.id),
      countryReference: topoiChips
        .filter((topos: any) => topos.type === "country")
        .map((topos: any) => topos.id),
    };

    dispatch(findStopForReport(queryVariables))
      .then((response: any) => {
        const stopPlaces = response.data.stopPlace;
        const stopPlaceIds: string[] = [];
        for (let i = 0; i < stopPlaces.length; i++) {
          if (stopPlaces[i].__typename === "ParentStopPlace") {
            const childStops = stopPlaces[i].children;
            for (let j = 0; j < childStops.length; j++) {
              stopPlaceIds.push(childStops[j].id);
            }
          } else {
            stopPlaceIds.push(stopPlaces[i].id);
          }
        }
        buildReportSearchQuery({ ...queryVariables, showFutureAndExpired });
        if (stopPlaceIds.length > 0) {
          dispatch(getParkingForMultipleStopPlaces(stopPlaceIds)).then(() => {
            setIsLoading(false);
            setActivePageIndex(0);
          });
        } else {
          setIsLoading(false);
          setActivePageIndex(0);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteChipById = (chipId: string) => {
    setTopoiChips((prev) => prev.filter((tc: any) => tc.id !== chipId));
  };

  const handleAddChip = (event: SyntheticEvent, value: any) => {
    if (value) {
      const addedChipsIds = topoiChips.map((tc) => tc.id);
      if (addedChipsIds.indexOf(value) === -1) {
        setTopoiChips([...topoiChips, value]);
        setTopographicPlaceFilterValue("");
      }
    }
  };

  const handleTopographicalPlaceSearch = (
    event: any,
    searchText: string,
    reason: string,
  ) => {
    if (reason === "clear") {
      setTopographicPlaceFilterValue("");
    }
    dispatch(topographicalPlaceSearch(searchText));
  };

  const createTopographicPlaceMenuItem = (
    place: any,
    formatMessageFunc: any,
  ) => {
    const name = getTopographicalNames(place);
    return {
      text: name,
      id: place.id,
      value: (
        <div
          style={{ display: "flex", flexDirection: "column", minWidth: 320 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.9em" }}>{name}</div>
            <div style={{ fontSize: "0.6em", color: "grey" }}>
              {formatMessageFunc({ id: place.topographicPlaceType })}
            </div>
          </div>
        </div>
      ),
      type: place.topographicPlaceType,
    };
  };

  const getTopographicalNames = (topographicalPlace: any) => {
    let name = topographicalPlace.name.value;
    if (
      topographicalPlace.topographicPlaceType === "municipality" &&
      topographicalPlace.parentTopographicPlace
    ) {
      name += `, ${topographicalPlace.parentTopographicPlace.name.value}`;
    }
    return name;
  };

  const filteredResults = hasParking
    ? dataSource.filter(
        (stopPlace: any) => stopPlace.parking && stopPlace.parking.length,
      )
    : dataSource;

  const topographicalPlacesDataSource = topographicalPlaces
    .filter(
      (place: any) =>
        place.topographicPlaceType === "county" ||
        place.topographicPlaceType === "municipality" ||
        place.topographicPlaceType === "country",
    )
    .filter(
      (place: any) =>
        topoiChips.map((chip) => chip.value).indexOf(place.id) === -1,
    )
    .map((place: any) => createTopographicPlaceMenuItem(place, formatMessage));

  const { setSearchBox } = useSearch();

  React.useEffect(() => {
    setSearchBox(
      <div className="search-container">
        <div className="search-box">
          <Autocomplete
            className="search-input"
            freeSolo
            getOptionLabel={(option: any) => `${option.text}`}
            options={topographicalPlacesDataSource}
            onInputChange={handleTopographicalPlaceSearch}
            inputValue={topographicPlaceFilterValue}
            onChange={handleAddChip}
            noOptionsText={formatMessage({ id: "no_results_found" })}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={formatMessage({ id: "filter_by_topography" })}
                onChange={(event) => {
                  if (event.target.value !== null) {
                    setTopographicPlaceFilterValue(event.target.value);
                  }
                }}
              />
            )}
            renderOption={(props, option: any, { selected }) => (
              <MenuItem {...props} key={option.id}>
                {option.value}
              </MenuItem>
            )}
          />
        </div>
      </div>,
    );
  }, [setSearchBox, topographicPlaceFilterValue]);
  return (
    <div>
      {/* Header with hamburger button below it */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              top: { xs: "110px", sm: "64px" },
              height: { xs: "calc(100% - 110px)", sm: "calc(100% - 64px)" },
            },
          },
        }}
      >
        <FilterDrawer
          onClose={() => setDrawerOpen(false)}
          formatMessage={formatMessage}
          locale={locale}
          stopTypeFilter={stopTypeFilter}
          handleApplyModalityFilters={handleApplyModalityFilters}
          topoiChips={topoiChips}
          handleDeleteChip={handleDeleteChipById}
          tags={tags}
          handleItemOnCheck={handleItemOnCheck}
          handleOnKeyDown={handleOnKeyDown}
          handleSearchQueryChange={handleSearchQueryChange}
          isLoading={isLoading}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
          withoutLocationOnly={withoutLocationOnly}
          withDuplicateImportedIds={withDuplicateImportedIds}
          withNearbySimilarDuplicates={withNearbySimilarDuplicates}
          showFutureAndExpired={showFutureAndExpired}
          withTags={withTags}
        />
      </Drawer>

      {/* Main Content Area */}
      <div style={{ marginTop: 20, padding: "0 20px" }}>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <ColumnFilterPopover
            style={{ marginRight: 2, transform: "scale(0.9)" }}
            columnOptions={columnOptionsStopPlace}
            handleColumnCheck={handleColumnStopPlaceCheck}
            buttonLabel={formatMessage({
              id: "column_filter_label_stop_place",
            })}
            captionLabel={formatMessage({ id: "stop_place" })}
            formatMessage={formatMessage}
            handleCheckAll={handleCheckAllColumnStops}
            selectAllLabel={formatMessage({ id: "all" })}
          />
          <ColumnFilterPopover
            style={{ marginLeft: 2, transform: "scale(0.9)" }}
            columnOptions={columnOptionsQuays}
            handleColumnCheck={handleColumnQuaysCheck}
            buttonLabel={formatMessage({ id: "column_filter_label_quays" })}
            captionLabel={formatMessage({ id: "quays" })}
            formatMessage={formatMessage}
            handleCheckAll={handleCheckAllColumnQuays}
            selectAllLabel={formatMessage({ id: "all" })}
          />
        </div>

        <ReportResultView
          activePageIndex={activePageIndex}
          intl={intl}
          results={filteredResults}
          stopPlaceColumnOptions={columnOptionsStopPlace}
          quaysColumnOptions={columnOptionsQuays}
          duplicateInfo={duplicateInfo}
        />
        <ReportPageFooter
          results={filteredResults}
          intl={intl}
          stopPlaceColumnOptions={columnOptionsStopPlace}
          quaysColumnOptions={columnOptionsQuays}
          handleSelectPage={handleSelectPage}
          activePageIndex={activePageIndex}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  topographicalPlaces: state.report.topographicalPlaces,
  results: state.report.results,
  duplicateInfo: state.report.duplicateInfo,
});

export default connect(mapStateToProps)(injectIntl(ReportPage));
