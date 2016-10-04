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
import cfgreader from './config/readConfig'
import { IntlProvider } from 'react-intl'
import configureLocalization from './localization/localization'

// used by material-ui, will be removed once the official React version of MI is relased
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

/* use authWithKeyCloak(renderIndex) for keycloak authentification */
function authWithKeyCloak(renderCallback) {
  let keycloakAuth = new Keycloak('config/keycloak.json')

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
      renderCallback()
  })
}

cfgreader.readConfig( (function(config) {
  window.config = config
  renderIndex(config.endpointBase)
}).bind(this))

function renderIndex(path) {

  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  configureLocalization(config).then( (localization) => {
    render(
      <Provider store={store}>
        <IntlProvider locale={localization.locale} messages={localization.messages}>
          <Router history={history}>
            <Route path={path} component={App}>
              <IndexRoute component={StopPlaces}/>
              <Route
                path={path + 'edit/:stopId'}
                component={EditStopPlace}
                />
            </Route>
          </Router>
        </IntlProvider>
      </Provider>,
      document.getElementById('root')
    )
  })

}
