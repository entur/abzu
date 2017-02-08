import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'
import Root from './containers/Root'
import configureStore from './store/store'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import cfgreader from './config/readConfig'
import 'intl'
import axios from 'axios'

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

  let token = JSON.parse(localStorage.getItem('GKT_TOKEN'))

  if (token != null && token.expires > new Date(Date.now()+(60*3*1000)).getTime()) {
    renderIndex(config.endpointBase)
  } else {
    axios.get(config.endpointBase + 'token')
      .then( response => {
        let token = JSON.stringify(response.data)
        localStorage.setItem('GKT_TOKEN', token)
        renderIndex(config.endpointBase)
      })
      .catch( (err) => {
        console.info('Failed to get GK token, Kartverket Flyfoto will not work', err)
        renderIndex(config.endpointBase)
      })
  }}).bind(this))

function renderIndex(path) {

  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  render (
    <Provider store={store}>
      <Root path={path} history={history}/>
    </Provider>,
    document.getElementById('root')
  )

}
