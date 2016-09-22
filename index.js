import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'
import StopPlaces from './containers/StopPlaces'
import EditStopPlace from './containers/EditStopPlace'
import App from './containers/App'
import configureStore from './store/store'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// used by material-ui, will be removed once the official React version of MI is relased
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

renderIndex()
/* use authWithKeyCloak(renderIndex) for keycloak authentification */
function authWithKeyCloak(renderCallback) {
  let keycloakAuth = new Keycloak('config/keycloak.json')

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
      renderCallback()
  })
}

function renderIndex() {

  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/admin/nsr/" component={App}>
          <IndexRoute component={StopPlaces}/>
          <Route path="/admin/nsr/edit/:stopId" component={EditStopPlace}/>
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
  )

}
