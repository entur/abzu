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
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";
import Header from "../components/Header";
import { injectIntl } from "react-intl";
import { getTheme } from "../config/themeConfig";
import SnackbarWrapper from "../components/SnackbarWrapper";
import BrowserSupport from "../components/BrowserSupport";

const muiThemeV0 = getMuiTheme(getTheme());
const muiTheme = createMuiTheme(getTheme());

class App extends React.Component {
  render() {
    const { children, intl } = this.props;

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
  }
}

export default injectIntl(App);
