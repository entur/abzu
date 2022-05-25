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
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import ArrowDropRight from "material-ui/svg-icons/navigation-arrow-drop-right";
import { getLogo } from "../config/themeConfig";
import MdAccount from "material-ui/svg-icons/action/account-circle";
import MdLanguage from "material-ui/svg-icons/action/language";
import MdSettings from "material-ui/svg-icons/action/settings";
import MdMap from "material-ui/svg-icons/maps/map";
import { UserActions } from "../actions/";
import { getIn } from "../utils";
import MdReport from "material-ui/svg-icons/content/report";
import MdHelp from "material-ui/svg-icons/action/help";
import { getTiamatEnv, getEnvColor } from "../config/themeConfig";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import { Button } from "@material-ui/core";
import { RaisedButton } from "material-ui";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmDialogOpen: false,
      actionOnDone: "GoToMain",
    };
  }

  goToMain() {
    this.props.dispatch(UserActions.navigateTo("/", ""));
  }

  handleConfirmChangeRoute(next, action) {
    const {
      stopHasBeenModified,
      isDisplayingReports,
      isDisplayingEditStopPlace,
    } = this.props;

    if (isDisplayingReports) {
      next();
    } else if (stopHasBeenModified && isDisplayingEditStopPlace) {
      this.setState({
        isConfirmDialogOpen: true,
        actionOnDone: action,
      });
    } else {
      next();
    }
  }

  handleSetLanguage(locale) {
    this.props.dispatch(UserActions.applyLocale(locale));
  }

  handleConfirm() {
    this.setState({
      isConfirmDialogOpen: false,
    });

    const { actionOnDone } = this.state;
    switch (actionOnDone) {
      case "GoToMain":
        this.goToMain();
        break;
      case "GoToReports":
        this.goToReports();
        break;
      default:
        console.info("Invalid action", actionOnDone, " ignored");
        break;
    }
  }

  handleLogOut() {
    if (this.props.auth) {
      this.props.auth.logout({ returnTo: window.location.origin });
    }
  }

  handleLogin() {
    if (this.props.auth) {
      this.props.auth.login();
    }
  }

  goToReports() {
    this.props.dispatch(UserActions.navigateTo("reports", ""));
  }

  handleTogglePublicCodePrivateCodeOnStopPlaces(value) {
    this.props.dispatch(
      UserActions.toggleEnablePublicCodePrivateCodeOnStopPlaces(value)
    );
  }

  handleToggleMultiPolylines(value) {
    this.props.dispatch(UserActions.togglePathLinksEnabled(value));
  }

  handleToggleCompassBearing(value) {
    this.props.dispatch(UserActions.toggleCompassBearingEnabled(value));
  }

  handleToggleShowExpiredStops(value) {
    this.props.dispatch(UserActions.toggleExpiredShowExpiredStops(value));
  }

  handleToggleMultimodalEdges(value) {
    this.props.dispatch(UserActions.toggleMultimodalEdges(value));
  }

  handleToggleShowPublicCode(value) {
    this.props.dispatch(UserActions.toggleShowPublicCode(value));
  }

  handleToggleShowFareZones(value) {
    this.props.dispatch(UserActions.toggleShowFareZonesInMap(value));
  }

  render() {
    const {
      intl,
      auth,
      isPublicCodePrivateCodeOnStopPlacesEnabled,
      isMultiPolylinesEnabled,
      isCompassBearingEnabled,
      showExpiredStops,
      showMultimodalEdges,
      showPublicCode,
      showFareZones,
    } = this.props;

    const { formatMessage, locale } = intl;

    const title = formatMessage({ id: "_title" });
    const language = formatMessage({ id: "language" });
    const english = formatMessage({ id: "english" });
    const norwegian = formatMessage({ id: "norwegian" });
    const swedish = formatMessage({ id: "swedish" });
    const french = formatMessage({ id: "french" });
    const logOut = formatMessage({ id: "log_out" });
    const logIn = formatMessage({ id: "log_in" });
    const settings = formatMessage({ id: "settings" });
    const publicCodePrivateCodeSetting = formatMessage({
      id: "publicCode_privateCode_setting_label",
    });
    const mapSettings = formatMessage({ id: "map_settings" });
    const showPathLinks = formatMessage({ id: "show_path_links" });
    const showCompassBearing = formatMessage({ id: "show_compass_bearing" });
    const reportSite = formatMessage({ id: "report_site" });
    const expiredStopLabel = formatMessage({ id: "show_expired_stops" });
    const userGuide = formatMessage({ id: "user_guide" });
    const username = getIn(auth, ["user", "name"], "");
    const showMultimodalEdgesLabel = formatMessage({
      id: "show_multimodal_edges",
    });
    const showPublicCodeLabel = formatMessage({ id: "show_public_code" });
    const showPrivateCodeLabel = formatMessage({ id: "show_private_code" });
    const quayCodeShowingLabel = formatMessage({ id: "quay_marker_label" });
    const showFareZonesLabel = formatMessage({ id: "show_fare_zones_label" });

    const tiamatEnv = getTiamatEnv();
    const logo = getLogo();

    return (
      <div>
        <AppBar
          style={{
            zIndex: 999,
            background: getEnvColor(tiamatEnv),
          }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {title}
                {(tiamatEnv === "test" || tiamatEnv === "development") && (
                  <span
                    style={{ fontSize: 18, marginLeft: 8, color: "#ddffa5" }}
                  >
                    {tiamatEnv}
                  </span>
                )}
              </div>
              <div style={{ height: "36px" }}>
                {!this.props.auth.isAuthenticated && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleLogin()}
                  >
                    {logIn}
                  </Button>
                )}
              </div>
            </div>
          }
          showMenuIconButton={true}
          iconElementLeft={
            <img
              alt=""
              src={logo}
              style={{ width: 40, height: "auto", cursor: "pointer" }}
              onClick={() =>
                this.handleConfirmChangeRoute(
                  this.goToMain.bind(this),
                  "GoToMain"
                )
              }
            />
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              targetOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <MenuItem
                leftIcon={<MdReport color="#41c0c4" />}
                primaryText={reportSite}
                onClick={() =>
                  this.handleConfirmChangeRoute(
                    this.goToReports.bind(this),
                    "GoToReports"
                  )
                }
                style={{ fontSize: 12, padding: 0 }}
              />
              <MenuItem
                primaryText={settings}
                rightIcon={<ArrowDropRight />}
                leftIcon={<MdSettings color="#41c0c4" />}
                style={{ fontSize: 12, padding: 0 }}
                desktop={true}
                multiple
                menuItems={[
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleTogglePublicCodePrivateCodeOnStopPlaces(
                        !isPublicCodePrivateCodeOnStopPlacesEnabled
                      )
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={isPublicCodePrivateCodeOnStopPlacesEnabled}
                    primaryText={publicCodePrivateCodeSetting}
                  />,
                ]}
              />
              <MenuItem
                primaryText={mapSettings}
                rightIcon={<ArrowDropRight />}
                leftIcon={<MdMap color="#41c0c4" />}
                style={{ fontSize: 12, padding: 0 }}
                desktop={true}
                multiple
                menuItems={[
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleMultiPolylines(!isMultiPolylinesEnabled)
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={isMultiPolylinesEnabled}
                    primaryText={showPathLinks}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleCompassBearing(!isCompassBearingEnabled)
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={isCompassBearingEnabled}
                    primaryText={showCompassBearing}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleShowExpiredStops(!showExpiredStops)
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={showExpiredStops}
                    primaryText={expiredStopLabel}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleMultimodalEdges(!showMultimodalEdges)
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={showMultimodalEdges}
                    primaryText={showMultimodalEdgesLabel}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    primaryText={quayCodeShowingLabel}
                    rightIcon={<ArrowDropRight />}
                    insetChildren
                    menuItems={[
                      <MenuItem
                        style={{ fontSize: 12, padding: 0 }}
                        onClick={() => this.handleToggleShowPublicCode(true)}
                        insetChildren
                        primaryText={showPublicCodeLabel}
                        checked={showPublicCode}
                      />,
                      <MenuItem
                        style={{ fontSize: 12, padding: 0 }}
                        onClick={() => this.handleToggleShowPublicCode(false)}
                        insetChildren
                        primaryText={showPrivateCodeLabel}
                        checked={!showPublicCode}
                      />,
                    ]}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleShowFareZones(!showFareZones)
                    }
                    insetChildren
                    desktop={true}
                    multiple
                    checked={showFareZones}
                    primaryText={showFareZonesLabel}
                  />,
                ]}
              />
              <MenuItem
                primaryText={language}
                rightIcon={<ArrowDropRight />}
                leftIcon={<MdLanguage color="#41c0c4" />}
                style={{ fontSize: 12, padding: 0 }}
                menuItems={[
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage("nb")}
                    insetChildren
                    primaryText={norwegian}
                    checked={locale === "nb"}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage("en")}
                    insetChildren
                    primaryText={english}
                    checked={locale === "en"}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage("fr")}
                    insetChildren
                    primaryText={french}
                    checked={locale === "fr"}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage("sv")}
                    insetChildren
                    primaryText={swedish}
                    checked={locale === "sv"}
                  />,
                ]}
              />
              <MenuItem
                leftIcon={<MdHelp color="#41c0c4" />}
                href="https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry"
                target="_blank"
                primaryText={userGuide}
                style={{ fontSize: 12, padding: 0 }}
              />
              {this.props.auth.isAuthenticated && (
                <MenuItem
                  leftIcon={<MdAccount color="#41c0c4" />}
                  primaryText={`${logOut} ${username}`}
                  onClick={() => this.handleLogOut()}
                  style={{ fontSize: 12, padding: 0 }}
                />
              )}
            </IconMenu>
          }
        />
        <ConfirmDialog
          open={this.state.isConfirmDialogOpen}
          handleClose={() => {
            this.setState({
              isConfirmDialogOpen: false,
            });
          }}
          handleConfirm={() => {
            this.handleConfirm();
          }}
          messagesById={{
            title: "discard_changes_title",
            body: "discard_changes_body",
            confirm: "discard_changes_confirm",
            cancel: "discard_changes_cancel",
          }}
          intl={intl}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  isDisplayingEditStopPlace:
    state.router.location.pathname.indexOf("/stop_place/") > -1,
  isDisplayingReports: state.router.location.pathname === "/reports",
  isPublicCodePrivateCodeOnStopPlacesEnabled:
    state.stopPlace.enablePublicCodePrivateCodeOnStopPlaces,
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  auth: state.roles.auth,
  showExpiredStops: state.stopPlace.showExpiredStops,
  showMultimodalEdges: state.stopPlace.showMultimodalEdges,
  showPublicCode: state.user.showPublicCode,
  stopHasBeenModified: state.stopPlace.stopHasBeenModified,
  showFareZones: state.mapUtils.showFareZones,
});

export default connect(mapStateToProps)(Header);
