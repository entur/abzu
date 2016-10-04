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
import axios from 'axios'
import { addLocaleData } from 'react-intl'


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
  axios.get(config.endpointBase + 'translation.json').then((response) => {
    renderIndex(config.endpointBase, response.data)
  })

}).bind(this))

function renderIndex(path, translation) {

  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  const locale = translation.locale
  const messages = JSON.parse(translation.messages)

  var lang = require('react-intl/locale-data/' + locale)
  addLocaleData(lang)

  render(
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
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

}
