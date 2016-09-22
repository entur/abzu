import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Loader from '../components/Loader'

import SearchBox from './SearchBox'
import { Link, browserHistory } from 'react-router'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import FlatButton from 'material-ui/FlatButton'
import {  AjaxActions } from '../actions/'
import cfgreader from './../config/readConfig'

require('../sass/main.scss')

class EditStopPlace extends React.Component {

  componentDidMount() {

      const { dispatch} = this.props

      cfgreader.readConfig( (function(config) {
        window.config = config
        var hrefId = window.location.pathname
          .replace(config.endpointBase + 'edit','')
          .replace('/', '')

        dispatch( AjaxActions.getStop(hrefId) )

      }).bind(this))
  }

  render() {

    let { activeMarkers, isLoading } = this.props

    return (
      <div>
        <FlatButton
           label="Back"
           onTouchTap={() => browserHistory.push('/')}
           style={{marginRight: 12}}
         />
        <p>
          Edit stop place
        </p>
        <EditStopMap/>
        { isLoading ? <Loader/> : <EditStopBox/> }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMarkers: state.editStopReducer.activeStopPlace,
    isLoading: state.editStopReducer.activeStopIsLoading,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStopPlace)
