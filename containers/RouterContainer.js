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


import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './App';
import StopPlaces from './StopPlaces';
import StopPlace from './StopPlace';
import ReportPage from './ReportPage';
import Routes from '../routes/';


class RouterContainer extends React.Component {
  render() {
    const { path, history } = this.props;

    const routes = (
      <Route path={path} component={App}>
        <IndexRoute component={StopPlaces} />
        <Route path={path + Routes.STOP_PLACE + '/:stopId'} component={StopPlace} />
        <Route path={path + 'reports'} component={ReportPage} />
      </Route>
    );

    return <Router history={history} routes={routes} />;
  }
}

export default RouterContainer;
