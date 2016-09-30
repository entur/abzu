import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Loader from '../components/Loader'
import SearchBox from './SearchBox'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import { AjaxActions } from '../actions/'
import cfgreader from './../config/readConfig'

require('../sass/main.scss')

class EditStopPlace extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }

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

  handleRequestClose() {
    this.setState({open: false})
  }

  render() {

    let { activeMarkers, isLoading } = this.props

    return (
      <div>
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
