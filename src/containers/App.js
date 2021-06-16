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

import React, { useEffect } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import { injectIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useAuth } from "@entur/auth-provider";
import Header from "../components/Header";
import { getTheme, getV0Theme } from "../config/themeConfig";
import SnackbarWrapper from "../components/SnackbarWrapper";
import BrowserSupport from "../components/BrowserSupport";
import { fetchPolygons, updateAuth } from "../actions/RolesActions";

const muiThemeV0 = getMuiTheme(getV0Theme());
const muiTheme = createMuiTheme(getTheme());

const App = ({ intl, children }) => {
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateAuth(auth));

    if (auth.isAuthenticated) {
      dispatch(fetchPolygons());
    }
  }, [auth]);

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <V0MuiThemeProvider muiTheme={muiThemeV0}>
          <div>
            <Header intl={intl} />
            {children}
            <SnackbarWrapper formatMessage={intl.formatMessage} />
            <BrowserSupport />
          </div>
        </V0MuiThemeProvider>
      </MuiThemeProvider>
    </>
  );
};

export default injectIntl(App);
