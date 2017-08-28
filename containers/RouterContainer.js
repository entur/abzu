import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './App';
import StopPlaces from './StopPlaces';
import EditPage from './EditPage';
import ReportPage from './ReportPage';

class RouterContainer extends React.Component {
  render() {
    const { path, history } = this.props;

    const routes = (
      <Route path={path} component={App}>
        <IndexRoute component={StopPlaces} />
        <Route path={path + 'edit/:stopId'} component={EditPage} />
        <Route path={path + 'reports'} component={ReportPage} />
      </Route>
    );

    return <Router history={history} routes={routes} />;
  }
}

export default RouterContainer;
