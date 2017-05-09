import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from './App'
import StopPlaces from './StopPlaces'
import EditStopPlace from './EditStopPlace'
import ReportPage from './ReportPage'

class RouterContainer extends React.Component {

  render() {

    const { path, history } = this.props

    const routes = (
      <Route path={path} component={App}>
        <IndexRoute component={StopPlaces}/>
        <Route
          path={path + 'edit/:stopId'}
          component={EditStopPlace}
          />
        <Route
          path={path + 'reports'}
          component={ReportPage}
          />
      </Route>
    )

    return (
      <Router history={history} routes={routes}/>
    )
  }
}

export default RouterContainer
