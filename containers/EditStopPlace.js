import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Loader from '../components/Loader'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import ToggleMapItemsBox from './ToggleMapItemsBox'
import NewElementsBox from './NewElementsBox'
import { AjaxActions } from '../actions/'
import cfgreader from './../config/readConfig'
import InformationBanner from '../components/InformationBanner'
import Information from '../config/information'
import { injectIntl } from 'react-intl'
import InformationManager from '../singletons/InformationManager'

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

  handleOnClickPathLinkInfo() {
    new InformationManager().setShouldPathLinkBeDisplayed(false)
  }

  render() {

    let { isLoading, isCreatingPolylines } = this.props
    const { locale } = this.props.intl

    const shouldDisplayMessage  =  (isCreatingPolylines && new InformationManager().getShouldPathLinkBeDisplayed())

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

export default injectIntl(connect(mapStateToProps)(EditStopPlace))
