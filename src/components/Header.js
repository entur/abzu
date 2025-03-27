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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { UserActions } from "../actions/";
import { getEnvColor, getLogo, getTiamatEnv } from "../config/themeConfig";
import { getIn } from "../utils";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import HeaderMenu from "./HeaderMenu";

const Header = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const { auth } = props;
  const { formatMessage, locale } = intl;

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionOnDone, setActionOnDone] = useState("GoToMain");
  const [anchorEl, setAnchorEl] = useState(null);

  const goToMain = () => {
    props.dispatch(UserActions.navigateTo("/", ""));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmChangeRoute = (next, action) => {
    const {
      stopHasBeenModified,
      isDisplayingReports,
      isDisplayingEditStopPlace,
    } = props;
    if (isDisplayingReports) {
      next();
    } else if (stopHasBeenModified && isDisplayingEditStopPlace) {
      setIsConfirmDialogOpen(true);
      setActionOnDone(action);
    } else {
      next();
    }
  };

  const handleConfirm = () => {
    setIsConfirmDialogOpen(false);
    if (actionOnDone === "GoToMain") {
      goToMain();
    } else if (actionOnDone === "GoToReports") {
      goToReports();
    } else {
      console.info("Invalid action", actionOnDone, "ignored");
    }
  };

  const handleLogin = () => {
    if (auth) {
      auth.login();
    }
  };
  const title = formatMessage({ id: "_title" });
  const tiamatEnv = getTiamatEnv();
  const headerColor = getEnvColor(tiamatEnv);
  const logoImg = getLogo();
  const username = getIn(auth, ["user", "name"], "");
  const logInText = formatMessage({ id: "log_in" });

  return (
    <div>
      <Helmet defaultTitle={title} titleTemplate={`${title} - %s`} />
      <AppBar position="static" sx={{ background: headerColor }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => handleConfirmChangeRoute(goToMain, "GoToMain")}
          >
            <img
              alt=""
              src={logoImg}
              style={{ width: 40, height: "auto", cursor: "pointer" }}
            />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div
              style={{
                fontSize: 24,
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
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
            </div>
          </Typography>

          <div style={{ height: "36px" }}>
            {!auth.isAuthenticated && (
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{ mr: 2, color: theme.custom.alternateTextColor.main }}
              >
                {logInText}
              </Button>
            )}
          </div>

          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon
              sx={{ color: theme.custom.alternateTextColor.main }}
            />
          </IconButton>

          <HeaderMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleConfirmChangeRoute={handleConfirmChangeRoute}
            isPublicCodePrivateCodeOnStopPlacesEnabled={
              props.isPublicCodePrivateCodeOnStopPlacesEnabled
            }
            isMultiPolylinesEnabled={props.isMultiPolylinesEnabled}
            isCompassBearingEnabled={props.isCompassBearingEnabled}
            showExpiredStops={props.showExpiredStops}
            showMultimodalEdges={props.showMultimodalEdges}
            showPublicCode={props.showPublicCode}
            showFareZones={props.showFareZones}
            showTariffZones={props.showTariffZones}
            auth={auth}
            username={username}
            dispatch={props.dispatch}
          />
        </Toolbar>
      </AppBar>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={() => setIsConfirmDialogOpen(false)}
        handleConfirm={handleConfirm}
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
};

const mapStateToProps = (state) => ({
  auth: state.user.auth,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  isDisplayingEditStopPlace:
    state.router.location.pathname.indexOf("/stop_place/") > -1,
  isDisplayingReports: state.router.location.pathname === "/reports",
  isPublicCodePrivateCodeOnStopPlacesEnabled:
    state.stopPlace.enablePublicCodePrivateCodeOnStopPlaces,
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  showExpiredStops: state.stopPlace.showExpiredStops,
  showMultimodalEdges: state.stopPlace.showMultimodalEdges,
  showPublicCode: state.user.showPublicCode,
  stopHasBeenModified: state.stopPlace.stopHasBeenModified,
  showFareZones: state.zones.showFareZones,
  showTariffZones: state.zones.showTariffZones,
});

export default connect(mapStateToProps)(Header);
