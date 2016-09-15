import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SearchBox from './SearchBox'
import { Link, browserHistory } from 'react-router'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'

require('../sass/main.scss')

export default class EditStopPlace extends React.Component {

  render() {
      return (
          <div>
            <button onClick={() => browserHistory.push('/')}>Back</button>
            <p>Edit stop place</p>
            <EditStopMap/>
            <EditStopBox/>
          </div>
      )
  }
}
