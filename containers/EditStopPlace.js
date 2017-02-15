import { connect } from 'react-redux'
import React, { PropTypes } from 'react'
import Loader from '../components/Loader'
import EditStopMap from './EditStopMap'
import EditStopBox from './EditStopBox'
import ToggleMapItemsBox from './ToggleMapItemsBox'
import NewElementsBox from './NewElementsBox'
import InformationBanner from '../components/InformationBanner'
import Information from '../config/information'
import { injectIntl } from 'react-intl'
import InformationManager from '../singletons/InformationManager'
import { stopQuery } from "../actions/Queries"
import { withApollo } from 'react-apollo'
import '../styles/main.css'
import { browserHistory } from 'react-router'

class EditStopPlace extends React.Component {

  handleOnClickPathLinkInfo() {
    new InformationManager().setShouldPathLinkBeDisplayed(false)
  }

  componentDidMount() {
    const { client } = this.props
    const idFromPath = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')).replace('/', '')

    if (idFromPath === 'new' && !this.props.stopPlace) {
      browserHistory.push('/')
    }

    if (idFromPath && idFromPath.length && idFromPath && idFromPath !== 'new') {
      client.query({
        query: stopQuery,
        variables: {
          id: idFromPath,
        }
      })
    }
  }

  render() {

    let { isCreatingPolylines, stopPlace } = this.props
    const { locale } = this.props.intl

    if (!stopPlace) return <Loader/>

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
        {
          stopPlace
            ?
            <div>
              <EditStopMap/>
              <EditStopBox/>
              <ToggleMapItemsBox/>
              <NewElementsBox/>
            </div>
            : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isCreatingPolylines: state.editingStop.isCreatingPolylines,
    stopPlace: state.stopPlace.current || state.stopPlace.newStop
  }
}

const EditStopPlaceWithIntl = injectIntl(connect(mapStateToProps)(EditStopPlace))

export default withApollo(EditStopPlaceWithIntl)
