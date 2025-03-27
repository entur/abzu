/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence.
 */

import { Check } from "@mui/icons-material";
import MdAccount from "@mui/icons-material/AccountCircle";
import MdHelp from "@mui/icons-material/Help";
import MdLanguage from "@mui/icons-material/Language";
import MdMap from "@mui/icons-material/Map";
import MdReport from "@mui/icons-material/Report";
import MdSettings from "@mui/icons-material/Settings";
import { Menu, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";
import { UserActions } from "../actions";
import {
  toggleShowFareZonesInMap,
  toggleShowTariffZonesInMap,
} from "../reducers/zonesSlice";
import MoreMenuItem from "./MainPage/MoreMenuItem";

const HeaderMenu = (props) => {
  const {
    anchorEl,
    setAnchorEl,
    handleConfirmChangeRoute,
    isPublicCodePrivateCodeOnStopPlacesEnabled,
    isMultiPolylinesEnabled,
    isCompassBearingEnabled,
    showExpiredStops,
    showMultimodalEdges,
    showPublicCode,
    showFareZones,
    showTariffZones,
    auth,
    username,
    dispatch,
  } = props;

  const intl = useIntl();
  const { formatMessage, locale } = intl;

  const language = formatMessage({ id: "language" });
  const english = formatMessage({ id: "english" });
  const norwegian = formatMessage({ id: "norwegian" });
  const swedish = formatMessage({ id: "swedish" });
  const french = formatMessage({ id: "french" });
  const logOutText = formatMessage({ id: "log_out" });
  const settings = formatMessage({ id: "settings" });
  const publicCodePrivateCodeSetting = formatMessage({
    id: "publicCode_privateCode_setting_label",
  });
  const mapSettings = formatMessage({ id: "map_settings" });
  const showPathLinks = formatMessage({ id: "show_path_links" });
  const showCompassBearingMsg = formatMessage({ id: "show_compass_bearing" });
  const reportSite = formatMessage({ id: "report_site" });
  const expiredStopLabel = formatMessage({ id: "show_expired_stops" });
  const userGuide = formatMessage({ id: "user_guide" });
  const showMultimodalEdgesLabel = formatMessage({
    id: "show_multimodal_edges",
  });
  const showPublicCodeLabel = formatMessage({ id: "show_public_code" });
  const showPrivateCodeLabel = formatMessage({ id: "show_private_code" });
  const quayCodeShowingLabel = formatMessage({ id: "quay_marker_label" });
  const showFareZonesLabel = formatMessage({ id: "show_fare_zones_label" });
  const showTariffZonesLabel = formatMessage({ id: "show_tariff_zones_label" });

  const handleToggleShowFareZones = (value) => {
    props.dispatch(toggleShowTariffZonesInMap(false));
    props.dispatch(toggleShowFareZonesInMap(value));
  };

  const handleToggleShowTariffZones = (value) => {
    props.dispatch(toggleShowFareZonesInMap(false));
    props.dispatch(toggleShowTariffZonesInMap(value));
  };

  const goToReports = () => {
    dispatch(UserActions.navigateTo("reports", ""));
  };

  const handleLogOut = () => {
    if (auth) {
      auth.logout({ returnTo: window.location.origin });
    }
  };

  const handleTogglePublicCodePrivateCodeOnStopPlaces = (value) => {
    dispatch(UserActions.toggleEnablePublicCodePrivateCodeOnStopPlaces(value));
  };

  const handleToggleMultiPolylines = (value) => {
    dispatch(UserActions.togglePathLinksEnabled(value));
  };

  const handleToggleCompassBearing = (value) => {
    dispatch(UserActions.toggleCompassBearingEnabled(value));
  };

  const handleToggleShowExpiredStops = (value) => {
    dispatch(UserActions.toggleExpiredShowExpiredStops(value));
  };

  const handleToggleMultimodalEdges = (value) => {
    dispatch(UserActions.toggleMultimodalEdges(value));
  };

  const handleToggleShowPublicCode = (value) => {
    dispatch(UserActions.toggleShowPublicCode(value));
  };

  const handleSetLanguage = (lang) => {
    dispatch(UserActions.applyLocale(lang));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem
        onClick={() => handleConfirmChangeRoute(goToReports, "GoToReports")}
        style={{
          fontSize: 12,
          padding: 0,
          paddingBottom: 5,
          paddingTop: 5,
          width: 300,
        }}
      >
        <MdReport color="#41c0c4" />
        {reportSite}
      </MenuItem>
      <MoreMenuItem
        openLeft={true}
        leftIcon={<MdSettings color="#41c0c4" />}
        label={settings}
        style={{
          fontSize: 12,
          padding: 0,
          paddingBottom: 5,
          paddingTop: 5,
          width: 300,
        }}
      >
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() =>
            handleTogglePublicCodePrivateCodeOnStopPlaces(
              !isPublicCodePrivateCodeOnStopPlacesEnabled,
            )
          }
        >
          {isPublicCodePrivateCodeOnStopPlacesEnabled ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {publicCodePrivateCodeSetting}
        </MenuItem>
      </MoreMenuItem>
      <MoreMenuItem
        openLeft={true}
        leftIcon={<MdMap color="#41c0c4" />}
        label={mapSettings}
        style={{
          fontSize: 12,
          padding: 0,
          paddingBottom: 5,
          paddingTop: 5,
          width: 300,
        }}
      >
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleMultiPolylines(!isMultiPolylinesEnabled)}
        >
          {isMultiPolylinesEnabled ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {showPathLinks}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleCompassBearing(!isCompassBearingEnabled)}
        >
          {isCompassBearingEnabled ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {showCompassBearingMsg}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleShowExpiredStops(!showExpiredStops)}
        >
          {showExpiredStops ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {expiredStopLabel}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleMultimodalEdges(!showMultimodalEdges)}
        >
          {showMultimodalEdges ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {showMultimodalEdgesLabel}
        </MenuItem>
        <MoreMenuItem
          openLeft={false}
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          leftIcon={<div style={{ width: "24px", height: "24px" }} />}
          label={quayCodeShowingLabel}
        >
          <MenuItem
            style={{
              fontSize: 12,
              padding: 0,
              paddingBottom: 5,
              paddingTop: 5,
              width: 300,
            }}
            onClick={() => handleToggleShowPublicCode(true)}
          >
            {showPublicCode ? (
              <Check />
            ) : (
              <div style={{ width: "24px", height: "24px" }} />
            )}
            {showPublicCodeLabel}
          </MenuItem>
          <MenuItem
            style={{
              fontSize: 12,
              padding: 0,
              paddingBottom: 5,
              paddingTop: 5,
              width: 300,
            }}
            onClick={() => handleToggleShowPublicCode(false)}
          >
            {!showPublicCode ? (
              <Check />
            ) : (
              <div style={{ width: "24px", height: "24px" }} />
            )}
            {showPrivateCodeLabel}
          </MenuItem>
        </MoreMenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleShowFareZones(!showFareZones)}
        >
          {showFareZones ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {showFareZonesLabel}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleToggleShowTariffZones(!showTariffZones)}
          checked={showTariffZones}
        >
          {showTariffZones ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {showTariffZonesLabel}
        </MenuItem>
      </MoreMenuItem>
      <MoreMenuItem
        openLeft={true}
        leftIcon={<MdLanguage color="#41c0c4" />}
        label={language}
        style={{
          fontSize: 12,
          padding: 0,
          paddingBottom: 5,
          paddingTop: 5,
          width: 300,
        }}
      >
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleSetLanguage("nb")}
          checked={locale === "nb"}
        >
          {locale === "nb" ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {norwegian}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleSetLanguage("en")}
          checked={locale === "en"}
        >
          {locale === "en" ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {english}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleSetLanguage("fr")}
          checked={locale === "fr"}
        >
          {locale === "fr" ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {french}
        </MenuItem>
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => handleSetLanguage("sv")}
          checked={locale === "sv"}
        >
          {locale === "sv" ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {swedish}
        </MenuItem>
      </MoreMenuItem>
      <MenuItem
        component={"a"}
        href="https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry"
        target="_blank"
        style={{
          fontSize: 12,
          padding: 0,
          paddingBottom: 5,
          paddingTop: 5,
          width: 300,
        }}
      >
        <MdHelp color="#41c0c4" />
        {userGuide}
      </MenuItem>
      {auth.isAuthenticated && (
        <MenuItem
          onClick={handleLogOut}
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
        >
          <MdAccount color="#41c0c4" />
          {`${logOutText} ${username}`}
        </MenuItem>
      )}
    </Menu>
  );
};

export default HeaderMenu;
