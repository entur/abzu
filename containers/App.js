import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SearchBox from './SearchBox'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// used by material-ui, will be removed once the official React version of MI is relased
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import Map from './Map'

require('../sass/main.scss')

export default class App extends React.Component {

  render() {
      return (
        <MuiThemeProvider>
          <div>
            <Header/>
            <SearchBox/>
            <Map/>
            <Footer/>
          </div>
        </MuiThemeProvider>
      )
  }
}
