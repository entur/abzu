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
import { Router, Route, IndexRoute } from "react-router";
import App from "./App";
import StopPlaces from "./StopPlaces";
import StopPlace from "./StopPlace";
import ReportPage from "./ReportPage";
import ReportPageV2 from "./ReportPageV2";
import Routes from "../routes/";
import GroupOfStopPlaces from "./GroupOfStopPlaces";

class RouterContainer extends React.Component {
  routes = (
    <Route path={this.props.path} component={App}>
      <IndexRoute component={StopPlaces} />
      <Route
        path={this.props.path + Routes.STOP_PLACE + "/:stopId"}
        component={StopPlace}
      />
      <Route
        path={this.props.path + Routes.GROUP_OF_STOP_PLACE + "/:groupId"}
        component={GroupOfStopPlaces}
      />
      <Route path={this.props.path + "reports"} component={ReportPage} />
      <Route path={this.props.path + "reportsV2"} component={ReportPageV2} />}
    </Route>
  );

  render() {
    const { history } = this.props;

    return <Router history={history} routes={this.routes} />;
  }
}

export default RouterContainer;
