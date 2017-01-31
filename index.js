import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Keycloak from 'keycloak-js'
import Root from './containers/Root'
import configureStore from './store/store'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import cfgreader from './config/readConfig'
import 'intl'
import { ApolloProvider } from 'react-apollo'

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
  const history = syncHistoryWithStore(browserHistory, store.self)

  render (
    <ApolloProvider store={store.self} client={store.client}>
      <Root path={path} history={history}/>
    </ApolloProvider>,
    document.getElementById('root')
  )

}
