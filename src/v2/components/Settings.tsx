import { Check } from "@mui/icons-material";
import MdAccount from "@mui/icons-material/AccountCircle";
import MdHelp from "@mui/icons-material/Help";
import MdReport from "@mui/icons-material/Report";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  IconButton,
  ListSubheader,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../actions/";
import {
  toggleShowFareZonesInMap,
  toggleShowTariffZonesInMap,
} from "../../reducers/zonesSlice";
import "../theme/style.css";

const Settings: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const intl = useIntl();
  const dispatch = useDispatch();

  // Redux selectors
  const auth = useSelector((state: any) => state.user.auth);
  const isPublicCodePrivateCodeOnStopPlacesEnabled = useSelector(
    (state: any) => state.stopPlace.enablePublicCodePrivateCodeOnStopPlaces,
  );
  const isMultiPolylinesEnabled = useSelector(
    (state: any) => state.stopPlace.enablePolylines,
  );
  const isCompassBearingEnabled = useSelector(
    (state: any) => state.stopPlace.isCompassBearingEnabled,
  );
  const showExpiredStops = useSelector(
    (state: any) => state.stopPlace.showExpiredStops,
  );
  const showMultimodalEdges = useSelector(
    (state: any) => state.stopPlace.showMultimodalEdges,
  );
  const showPublicCode = useSelector((state: any) => state.user.showPublicCode);
  const showFareZones = useSelector((state: any) => state.zones.showFareZones);
  const showTariffZones = useSelector(
    (state: any) => state.zones.showTariffZones,
  );

  const reportSite = intl.formatMessage({ id: "report_site" });
  const publicCodePrivateCodeSetting = intl.formatMessage({
    id: "publicCode_privateCode_setting_label",
  });
  const mapSettings = intl.formatMessage({ id: "map_settings" });
  const showPathLinks = intl.formatMessage({ id: "show_path_links" });
  const showCompassBearing = intl.formatMessage({ id: "show_compass_bearing" });
  const expiredStopLabel = intl.formatMessage({ id: "show_expired_stops" });
  const showMultimodalEdgesLabel = intl.formatMessage({
    id: "show_multimodal_edges",
  });
  const quayCodeShowingLabel = intl.formatMessage({
    id: "quay_marker_label",
  });
  const showPublicCodeLabel = intl.formatMessage({ id: "show_public_code" });
  const showPrivateCodeLabel = intl.formatMessage({ id: "show_private_code" });
  const showFareZonesLabel = intl.formatMessage({
    id: "show_fare_zones_label",
  });
  const showTariffZonesLabel = intl.formatMessage({
    id: "show_tariff_zones_label",
  });
  const languageLabel = intl.formatMessage({ id: "language" });
  const english = intl.formatMessage({ id: "english" });
  const norwegian = intl.formatMessage({ id: "norwegian" });
  const french = intl.formatMessage({ id: "french" });
  const swedish = intl.formatMessage({ id: "swedish" });
  const userGuide = intl.formatMessage({ id: "user_guide" });
  const logOutText = intl.formatMessage({ id: "log_out" });
  const currentLocale = intl.locale;

  const username = auth && auth.user ? auth.user.name : "";

  // Handlers
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoToReports = () => {
    // @ts-ignore
    dispatch(UserActions.navigateTo("reports", ""));
    handleClose();
  };

  const handleTogglePublicCodePrivateCodeOnStopPlaces = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.toggleEnablePublicCodePrivateCodeOnStopPlaces(value));
    handleClose();
  };

  const handleToggleMultiPolylines = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.togglePathLinksEnabled(value));
    handleClose();
  };

  const handleToggleCompassBearing = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.toggleCompassBearingEnabled(value));
    handleClose();
  };

  const handleToggleShowExpiredStops = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.toggleExpiredShowExpiredStops(value));
    handleClose();
  };

  const handleToggleMultimodalEdges = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.toggleMultimodalEdges(value));
    handleClose();
  };

  const handleToggleShowPublicCode = (value: boolean) => {
    // @ts-ignore
    dispatch(UserActions.toggleShowPublicCode(value));
    handleClose();
  };

  const handleToggleShowFareZones = (value: boolean) => {
    // @ts-ignore
    dispatch(toggleShowTariffZonesInMap(false));
    // @ts-ignore
    dispatch(toggleShowFareZonesInMap(value));
    handleClose();
  };

  const handleToggleShowTariffZones = (value: boolean) => {
    // @ts-ignore
    dispatch(toggleShowTariffZonesInMap(value));
    // @ts-ignore
    dispatch(toggleShowFareZonesInMap(false));
    handleClose();
  };

  const handleSetLanguage = (lang: string) => {
    // @ts-ignore
    dispatch(UserActions.applyLocale(lang));
    handleClose();
  };

  const handleLogOut = () => {
    if (auth) {
      auth.logout({ returnTo: window.location.origin });
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="settings menu"
        onClick={handleOpen}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        id="settings-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="settings-menu-container"
      >
        <MenuList dense>
          <MenuItem onClick={handleGoToReports} className="settings-menu-item">
            <MdReport className="settings-icon" style={{ color: "#41c0c4" }} />
            {reportSite}
          </MenuItem>
          <Divider />
          <ListSubheader className="settings-list-subheader">
            {mapSettings}
          </ListSubheader>
          <MenuItem
            onClick={() =>
              handleTogglePublicCodePrivateCodeOnStopPlaces(
                !isPublicCodePrivateCodeOnStopPlacesEnabled,
              )
            }
            className="settings-menu-item"
          >
            {isPublicCodePrivateCodeOnStopPlacesEnabled ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {publicCodePrivateCodeSetting}
          </MenuItem>

          <MenuItem
            onClick={() => handleToggleMultiPolylines(!isMultiPolylinesEnabled)}
            className="settings-menu-item"
          >
            {isMultiPolylinesEnabled ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showPathLinks}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleCompassBearing(!isCompassBearingEnabled)}
            className="settings-menu-item"
          >
            {isCompassBearingEnabled ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showCompassBearing}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleShowExpiredStops(!showExpiredStops)}
            className="settings-menu-item"
          >
            {showExpiredStops ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {expiredStopLabel}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleMultimodalEdges(!showMultimodalEdges)}
            className="settings-menu-item"
          >
            {showMultimodalEdges ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showMultimodalEdgesLabel}
          </MenuItem>
          <Divider />
          <ListSubheader className="settings-list-subheader">
            {quayCodeShowingLabel}
          </ListSubheader>
          <MenuItem
            onClick={() => handleToggleShowPublicCode(true)}
            className="settings-menu-item"
          >
            {showPublicCode ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showPublicCodeLabel}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleShowPublicCode(false)}
            className="settings-menu-item"
          >
            {!showPublicCode ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showPrivateCodeLabel}
          </MenuItem>

          <MenuItem
            onClick={() => handleToggleShowFareZones(!showFareZones)}
            className="settings-menu-item"
          >
            {showFareZones ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showFareZonesLabel}
          </MenuItem>
          <MenuItem
            onClick={() => handleToggleShowTariffZones(!showTariffZones)}
            className="settings-menu-item"
          >
            {showTariffZones ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {showTariffZonesLabel}
          </MenuItem>
          <Divider />
          <ListSubheader className="settings-list-subheader">
            {languageLabel}
          </ListSubheader>
          <MenuItem
            onClick={() => handleSetLanguage("nb")}
            className="settings-menu-item"
          >
            {currentLocale === "nb" ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {norwegian}
          </MenuItem>
          <MenuItem
            onClick={() => handleSetLanguage("en")}
            className="settings-menu-item"
          >
            {currentLocale === "en" ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {english}
          </MenuItem>
          <MenuItem
            onClick={() => handleSetLanguage("fr")}
            className="settings-menu-item"
          >
            {currentLocale === "fr" ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {french}
          </MenuItem>
          <MenuItem
            onClick={() => handleSetLanguage("sv")}
            className="settings-menu-item"
          >
            {currentLocale === "sv" ? (
              <Check className="settings-icon" />
            ) : (
              <div className="settings-icon" />
            )}
            {swedish}
          </MenuItem>
          <Divider />
          <MenuItem
            component="a"
            href="https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry"
            target="_blank"
            onClick={handleClose}
            className="settings-menu-item"
          >
            <MdHelp className="settings-icon" style={{ color: "#41c0c4" }} />
            {userGuide}
          </MenuItem>

          {auth && auth.isAuthenticated && (
            <MenuItem onClick={handleLogOut} className="settings-menu-item">
              <MdAccount
                className="settings-icon"
                style={{ color: "#41c0c4" }}
              />
              {`${logOutText} ${username}`}
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
};

export default Settings;
