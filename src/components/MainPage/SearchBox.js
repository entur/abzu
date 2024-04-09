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

import { connect } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import RaisedButton from "@mui/material/Button";
import FlatButton from "@mui/material/Button";
import MdMore from "@mui/icons-material/ExpandMore";
import { StopPlaceActions, UserActions } from "../../actions/";
import SearchBoxDetails from "./SearchBoxDetails";
import NewStopPlace from "./CreateNewStop";
import { injectIntl } from "react-intl";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteManager from "../../singletons/FavoriteManager";
import CoordinatesDialog from "../Dialogs/CoordinatesDialog";
import {
  findEntitiesWithFilters,
  findTopographicalPlace,
} from "../../actions/TiamatActions";
import FavoritePopover from "./FavoritePopover";
import ModalityFilter from "../EditStopPage/ModalityFilter";
import FavoriteNameDialog from "../Dialogs/FavoriteNameDialog";
import TopographicalFilter from "./TopographicalFilter";
import debounce from "lodash.debounce";
import { getIn } from "../../utils/";
import { getPrimaryDarkerColor } from "../../config/themeConfig";
import MdLocationSearching from "@mui/icons-material/LocationSearching";
import MdSpinner from "../../static/icons/spinner";
import { createSearchMenuItem } from "./SearchMenuItem";
import Menu from "@mui/material/Menu";
import CheckBox from "@mui/material/Checkbox";
import Routes from "../../routes/";
import { Entities } from "../../models/Entities";
import RoleParser from "../../roles/rolesParser";
import {Box, Button, Checkbox, FormControlLabel, FormGroup, Popover} from "@mui/material";
import TextField from "@mui/material/TextField";
import ModalityIconImg from "./ModalityIconImg";
import {topographicPlaceStyle} from "./SearchMenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";


class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreFilterOptions: false,
      createNewStopOpen: false,
      coordinatesDialogOpen: false,
      loading: false,
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

      this.props
        .dispatch(
          findEntitiesWithFilters(
            searchText,
            stopPlaceTypes,
            chips,
            showFutureAndExpired,
          ),
        )
        .then(() => {
          this.setState({ loading: false });
        });
    };
    this.debouncedSearch = debounce(searchStop, 500);
  }

  handleSearchUpdate(event, searchText) {
    // prevents ghost clicks
    if (this.props.params && this.props.params.source === "click") {
      return;
    }
    if (!searchText || !searchText.length) {
      this.props.dispatch(UserActions.clearSearchResults());
      this.props.dispatch(UserActions.setSearchText(""));
    } else if (searchText.indexOf("(") > -1 && searchText.indexOf(")") > -1) {

    } else {
      this.props.dispatch(UserActions.setSearchText(searchText));
      this.debouncedSearch(searchText, this.props.dataSource, this.props.params, this.props.filter);
    }
  }

  handleEdit(id, entityType) {
    const route =
      entityType === Entities.STOP_PLACE
        ? Routes.STOP_PLACE
        : Routes.GROUP_OF_STOP_PLACE;
    this.props.dispatch(UserActions.navigateTo(`/${route}/`, id));
  }

  handleSaveAsFavorite() {
    this.props.dispatch(UserActions.openFavoriteNameDialog());
  }

  removeFiltersAndSearch() {
    this.props.dispatch(UserActions.removeAllFilters());
    this.handleSearchUpdate(this.props.searchText, null, null, {
      topoiChips: [],
      stopTypeFilter: [],
    });
  }

  handleRetrieveFilter(filter) {
    this.props.dispatch(UserActions.loadFavoriteSearch(filter));
    this.handleSearchUpdate(filter.searchText, null, null, filter);

    this.refs.searchText.setState({
      open: true,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchText),
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
        stopType: stopTypeFilter,
      });
    }
    this.props.dispatch(UserActions.toggleShowFutureAndExpired(value));
  }

  handleTopographicalPlaceInput(event,searchText) {
    const { dispatch } = this.props;
    dispatch(findTopographicalPlace(searchText));
  }

  handleNewRequest(event,result) {
    if (typeof result.element !== "undefined") {
      this.props.dispatch(StopPlaceActions.setMarkerOnMap(result.element));
    }
  }

  handleOpenCoordinatesDialog() {
    this.setState({
      coordinatesDialogOpen: true,
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
        stopType: filters,
      });
    }
    this.props.dispatch(UserActions.applyStopTypeSearchFilter(filters));
  }

  handleSubmitCoordinates(position) {
    this.props.dispatch(StopPlaceActions.changeMapCenter(position, 11));
    this.props.dispatch(
      UserActions.setMissingCoordinates(position, this.props.chosenResult.id),
    );

    this.setState({
      coordinatesDialogOpen: false,
    });
  }

  handleAddChip({ text, type, id }) {
    const { searchText, stopTypeFilters, showFutureAndExpired, topoiChips } =
      this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired,
        topoiChips: topoiChips.concat({
          text,
          type,
          value: id,
        }),
        stopType: stopTypeFilters,
      });
    }
    this.props.dispatch(
      UserActions.addToposChip({ text: text, type: type, value: id }),
    );
    this.refs.topoFilter.setState({
      searchText: "",
    });
  }

  handleDeleteChip(chipValue) {
    const {
      dispatch,
      searchText,
      stopTypeFilters,
      showFutureAndExpired,
      topoiChips,
    } = this.props;
    if (searchText) {
      this.handleSearchUpdate(searchText, null, null, {
        showFutureAndExpired,
        topoiChips: topoiChips.filter((chip) => chip.value !== chipValue),
        stopType: stopTypeFilters,
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
    this.props.dispatch(UserActions.setSearchText(""));
  }

  handleToggleFilter(value) {
    this.setState({
      showMoreFilterOptions: value,
    });
  }

  getTopographicalNames(topographicalPlace) {
    let name = topographicalPlace.name.value;

    if (
      topographicalPlace.topographicPlaceType === "municipality" &&
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
      menuItems = dataSource.map((element) =>
        createSearchMenuItem(element, formatMessage),
      );
    } else {
      menuItems = [
        {
          text: "",
          value: (
              <MenuItem
                  style={{paddingLeft: 10, paddingRight: 10, width: "auto"}}

              >
                <div style={{fontWeight: 600, fontSize: "0.8em"}}>
                  {formatMessage({id: "no_results_found"})}
                </div>
              </MenuItem>
          ),
        },
      ];
    }

    if (stopTypeFilter.length || topoiChips.length) {
      const filterNotification = {
        text: "",
        value: (
          <MenuItem
            style={{
              paddingRight: 10,
              width: "auto",
              paddingTop: 2,
              paddingBottom: 2,
            }}
            disabled={true}
            primaryText={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #000",
                }}
              >
                <span style={{ fontSize: "0.8em", color: "#777" }}>
                  {formatMessage({ id: "filters_are_applied" })}
                </span>
                <span
                  onClick={() => this.removeFiltersAndSearch()}
                  style={{
                    fontSize: "0.8em",
                    color: getPrimaryDarkerColor(),
                    marginRight: 5,
                    cursor: "pointer",
                  }}
                >
                  {formatMessage({ id: "remove" })}
                </span>
              </div>
            }
          />
        ),
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
      roleAssignments,
      lookupCoordinatesOpen,
      newStopIsMultiModal,
      dataSource,
      showFutureAndExpired,
    } = this.props;
    const { coordinatesDialogOpen, showMoreFilterOptions, loading } =
      this.state;

    const { formatMessage, locale } = intl;
    const menuItems = this.getMenuItems(this.props);
    const Loading = loading &&
      !dataSource.length && [
        {
          text: "",
          value: (
            <MenuItem
              style={{ paddingRight: 10, width: "auto" }}
              primaryText={
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.8em",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MdSpinner />
                  <div style={{ marginLeft: 5 }}>
                    {formatMessage({ id: "loading" })}
                  </div>
                </div>
              }
            />
          ),
        },
      ];

    const topographicalPlacesDataSource = topographicalPlaces
      .filter(
        (place) =>
          place.topographicPlaceType === "county" ||
          place.topographicPlaceType === "municipality" ||
          place.topographicPlaceType === "country",
      )
      .filter(
        (place) =>
          topoiChips.map((chip) => chip.value).indexOf(place.id) === -1,
      )
      .map((place) => {
        const name = this.getTopographicalNames(place);
        return {
          text: name,
          id: place.id,
          value: (
              <MenuItem
                key={place.id}
              >

                  <div
                      style={{
                        marginLeft: 10,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 380,
                      }}
                  >
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{fontSize: "0.9em"}}>{name}</div>
                      <div style={{fontSize: "0.6em", color: "grey"}}>
                        {formatMessage({id: place.topographicPlaceType})}
                      </div>
                    </div>
                  </div>

              </MenuItem>
      ),
      type: place.topographicPlaceType,
      };
      });

      const newStopText = {
        headerText: formatMessage({
          id: newStopIsMultiModal
              ? "making_parent_stop_place_title"
              : "making_stop_place_title",
        }),
            bodyText
      :
        formatMessage({id: "making_stop_place_hint"}),
      };

      let favoriteText = {
        title: formatMessage({id: "favorites_title"}),
            noFavoritesFoundText
      :
        formatMessage({id: "no_favorites_found"}),
      };

      const text = {
        emptyDescription: formatMessage({ id: "empty_description" }),
      edit: formatMessage({ id: "edit" }),
      view: formatMessage({ id: "view" }),
    };

    const formControlLabelStyle = {
      "& .MuiFormControlLabel-label": {
        fontSize: "0.8em"
      }
    }

    const searchBoxWrapperStyle = {
      top: 60,
      background: "#fff",
      height: "auto",
      width: 460,
      margin: 8,
      position: "absolute",
      zIndex: 999,
      padding: 8,
      border: "1px solid rgb(81, 30, 18)",
    };

    const filterOptions = createFilterOptions({
      matchFrom: 'any',
      stringify: (option) => option.text,
    });

    return (
      <div>
        <CoordinatesDialog
          open={lookupCoordinatesOpen}
          handleClose={this.handleCloseLookupCoordinatesDialog.bind(this)}
          handleConfirm={this.handleLookupCoordinates.bind(this)}
          titleId={"lookup_coordinates"}
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
              caption={formatMessage({ id: "favorites" })}
              items={[]}
              filter={stopTypeFilter}
              onItemClick={this.handleRetrieveFilter.bind(this)}
              onDismiss={this.handlePopoverDismiss.bind(this)}
              text={favoriteText}
            />
            <div
              style={{
                width: "100%",
                margin: "auto",
                border: "1px solid hsla(182, 53%, 51%, 0.1)",
              }}
            >
              <ModalityFilter
                locale={locale}
                stopTypeFilter={stopTypeFilter}
                handleApplyFilters={this.handleApplyModalityFilters.bind(this)}
              />
              {showMoreFilterOptions ? (
                <div>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <Button
                      onClick={() => this.handleToggleFilter(false)}
                      style={{ fontSize: 12, paddingBottom: "12px" }}
                    >
                      {formatMessage({ id: "filters_less" })}
                    </Button>
                  </div>
                  <div style={{ alignItems: "center" }}>
                    <Autocomplete
                      floatingLabelText={formatMessage({
                        id: "filter_by_topography",
                      })}
                      getOptionLabel={(option) => `${option.text}`}
                      hintText={formatMessage({ id: "filter_by_topography" })}
                      options={topographicalPlacesDataSource}
                      onInputChange={this.handleTopographicalPlaceInput.bind(
                        this,
                      )}
                      listStyle={{ width: "auto", minWidth: 300 }}
                      style={{
                        margin: "auto",
                        width: "100%",
                        marginTop: -20,
                      }}
                      maxSearchResults={7}
                      ref="topoFilter"
                      onNewRequest={this.handleAddChip.bind(this)}
                      renderInput={(params) => (

                          <TextField
                              {...params}

                              variant="standard"
                              label={formatMessage({id: "filter_by_topography"})}
                          />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <>
                          {option.value}
                        </>
                      )}
                    />
                    <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={showFutureAndExpired}
                          onCheck={(e, value) =>
                              this.toggleShowFutureAndExpired(value)
                          }
                          />
                        }
                        label={
                          formatMessage({id: "show_future_expired_and_terminated",})
                        }
                        sx = {formControlLabelStyle}
                      />
                    </FormGroup>
                    </div>
                  </div>
                  <TopographicalFilter
                    topoiChips={topoiChips}
                    handleDeleteChip={this.handleDeleteChip.bind(this)}
                  />
                </div>
              ) : (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <FlatButton
                    style={{ fontSize: 12 }}
                    onClick={() => this.handleToggleFilter(true)}
                  >
                    {formatMessage({ id: "filters_more" })}
                  </FlatButton>
                </div>
              )}
            </div>

            <Autocomplete

              //animated={false}
              //openOnFocus
              freeSolo
              options={menuItems}
              loading={true}
              //filterOptions={(x) => x !== ""}
              //filterOptions={filterOptions}
              onInputChange={this.handleSearchUpdate.bind(this)}
              //maxSearchResults={10}
              //inputValue={this.state.searchText}
              //dataSource={
              //  loading && !dataSource.length ? Loading : menuItems || []
              //}
              renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.id}>
                    {option.value}
                  </li>
              )}
              onChange={this.handleNewRequest.bind(this)}
              getOptionLabel={(option) => `${option.text}`}
                //getOptionLabel={option.value}
                //renderOption={(props, option) => (
                //    <Box component="li" {...props}>
                //      {option.text}{option.value}
                //    </Box>
                //)}
              renderInput={(params) => (

                  <Box sx={{display: 'flex', alignItems: 'flex-end'}}>

                    <SearchIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
                    <TextField
                        {...params}
                        sx={{width: 380}}
                        label={formatMessage({id: "filter_by_name"})}
                        variant="standard"
                    />


                  </Box>


              )}
            />


          </div>
          <div style={{marginBottom: 5, textAlign: "right", marginRight: 10}}>
            <FlatButton
                style={{marginLeft: 10, fontSize: 12}}
                disabled={!!favorited}
                onClick={() => {
                  this.handleSaveAsFavorite(!!favorited);
                }}
            >
              {formatMessage({id: "filter_save_favorite"})}
            </FlatButton>
          </div>
          <div key="searchbox-edit">
            {chosenResult ? (
                <SearchBoxDetails
                    handleEdit={this.handleEdit.bind(this)}
                result={chosenResult}
                handleChangeCoordinates={this.handleOpenCoordinatesDialog.bind(
                  this,
                )}
                userSuppliedCoordinates={
                  missingCoordinatesMap &&
                  missingCoordinatesMap[chosenResult.id]
                }
                text={text}
                canEdit={canEdit}
                formatMessage={formatMessage}
              />
            ) : null}
            {!RoleParser.isGuest(roleAssignments) && (
              <div style={{ marginTop: 10 }}>
                {isCreatingNewStop ? (
                  <NewStopPlace
                    text={newStopText}
                    onClose={() => this.setState({ createNewStopOpen: false })}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <RaisedButton
                      onClick={this.handleOpenLookupCoordinatesDialog.bind(
                        this,
                      )}
                      icon={
                        <MdLocationSearching
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      primary={false}
                      labelStyle={{ fontSize: 11 }}
                      label={formatMessage({ id: "lookup_coordinates" })}
                    />
                    <RaisedButton
                      onClick={(e) => {
                        this.setState({
                          createNewStopOpen: true,
                          anchorEl: e.currentTarget,
                        });
                      }}
                      icon={<MdMore style={{ width: 20, height: 20 }} />}
                      primary={true}
                      labelStyle={{ fontSize: 11 }}
                      label={formatMessage({ id: "new_stop" })}
                    />
                    <Popover
                      open={this.state.createNewStopOpen}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{
                        horizontal: "left",
                        vertical: "bottom",
                      }}
                      targetOrigin={{ horizontal: "left", vertical: "top" }}
                      onClose={() => {
                        this.setState({ createNewStopOpen: false });
                      }}
                    >
                      <Menu open>
                        <MenuItem
                          onClick={() => this.handleNewStop(false)}
                          style={{ fontSize: "0.9em" }}
                          primaryText={formatMessage({ id: "new_stop" })}
                        />
                        <MenuItem
                          onClick={() => this.handleNewStop(true)}
                          style={{ fontSize: "0.9em" }}
                          primaryText={formatMessage({
                            id: "new__multi_stop",
                          })}
                        />
                      </Menu>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const favoriteManager = new FavoriteManager();
  const { stopType, topoiChips, text } = state.user.searchFilters;
  const favoriteContent = favoriteManager.createSavableContent(
    "",
    text,
    stopType,
    topoiChips,
  );
  const favorited = favoriteManager.isFavoriteAlreadyStored(favoriteContent);

  return {
    chosenResult: state.stopPlace.activeSearchResult,
    dataSource: state.stopPlace.searchResults || [],
    isCreatingNewStop: state.user.isCreatingNewStop,
    stopTypeFilter: state.user.searchFilters.stopType,
    topoiChips: state.user.searchFilters.topoiChips,
    favorited,
    missingCoordinatesMap: state.user.missingCoordsMap,
    searchText: state.user.searchFilters.text,
    topographicalPlaces: state.stopPlace.topographicalPlaces || [],
    canEdit: getIn(
      state.roles,
      ["allowanceInfoSearchResult", "canEdit"],
      false,
    ),
    roleAssignments: state.roles.auth.roleAssignments,
    lookupCoordinatesOpen: state.user.lookupCoordinatesOpen,
    newStopIsMultiModal: state.user.newStopIsMultiModal,
    showFutureAndExpired: state.user.searchFilters.showFutureAndExpired,
  };
};

export default injectIntl(connect(mapStateToProps)(SearchBox));
