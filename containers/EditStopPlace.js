import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Loader from '../components/Loader'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import ToggleMapItemsBox from './ToggleMapItemsBox'
import { AjaxActions } from '../actions/'
import cfgreader from './../config/readConfig'

require('../styles/main.css')

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

    let { isLoading } = this.props

    return (
      <div>
        <EditStopMap/>
        { isLoading ? <Loader/> : <EditStopBox/> }
        { isLoading ? null : <ToggleMapItemsBox/> }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoading: state.editStopReducer.activeStopIsLoading
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
