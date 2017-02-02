import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Loader from '../components/Loader'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import ToggleMapItemsBox from './ToggleMapItemsBox'
import NewElementsBox from './NewElementsBox'
import InformationBanner from '../components/InformationBanner'
import Information from '../config/information'
import { injectIntl } from 'react-intl'
import InformationManager from '../singletons/InformationManager'
import { stopQuery } from "../actions/queries"
import { graphql } from 'react-apollo'
import { AjaxActions } from '../actions/'
import cfgreader from './../config/readConfig'

require('../styles/main.css')

class EditStopPlace extends React.Component {

  componentDidMount() {
    const { dispatch} = this.props
    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(AjaxActions.getStop(getIdFromPath()))
    }).bind(this))
  }

  handleOnClickPathLinkInfo() {
    new InformationManager().setShouldPathLinkBeDisplayed(false)
  }

  render() {

    let { isLoading, isCreatingPolylines } = this.props
    const { locale } = this.props.intl

    const shouldDisplayMessage  = (isCreatingPolylines && new InformationManager().getShouldPathLinkBeDisplayed())

    return (
      <div>
        { shouldDisplayMessage
          ?
          <InformationBanner
            title={Information[locale].path_links.title}
            ingress={Information[locale].path_links.ingress}
            body={Information[locale].path_links.body}
            closeButtonTitle={Information[locale].path_links.closeButtonTitle}
            handleOnClick={this.handleOnClickPathLinkInfo.bind(this)}
          />
          : null
        }
        <EditStopMap/>
        { isLoading ? <Loader/> : <EditStopBox/> }
        { isLoading ? null : <ToggleMapItemsBox/> }
        { isLoading ? null : <NewElementsBox/> }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.editingStop.activeStopIsLoading,
    isCreatingPolylines: state.editingStop.isCreatingPolylines
  }
}

const getIdFromPath = () => window.location.pathname.substring(window.location.pathname.lastIndexOf('/')).replace('/', '')

const EditStopPlaceWithData = graphql(stopQuery, { options: { variables: { id: getIdFromPath() } } })(EditStopPlace)

export default injectIntl(connect(mapStateToProps)(EditStopPlaceWithData))
