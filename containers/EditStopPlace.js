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
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { UserActions } from '../actions/'

class EditStopPlace extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showErrorDialog: false
    }
  }

  handleOnClickPathLinkInfo() {
    new InformationManager().setShouldPathLinkBeDisplayed(false)
  }

  componentWillMount() {
    const { client, dispatch } = this.props
    const idFromPath = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')).replace('/', '')

    if (idFromPath === 'new' && !this.props.stopPlace) {
      dispatch(UserActions.navigateTo('/', ''))
    }

    if (idFromPath && idFromPath.length && idFromPath && idFromPath !== 'new') {
      client.query({
        query: stopQuery,
        variables: {
          id: idFromPath,
        }
      }).catch( err => {
        this.setState({
          showErrorDialog: true
        })
      })
    }
  }

  handleCloseErrorDialog() {
    this.props.dispatch(UserActions.navigateTo('/', ''))
    this.setState({ showErrorDialog: false })
  }

  render() {

    let { isCreatingPolylines, stopPlace } = this.props
    const { locale, formatMessage } = this.props.intl

    const actions = [
      <FlatButton
        label={formatMessage({id: 'cancel'})}
        onTouchTap={this.handleCloseErrorDialog.bind(this)}
      />,
    ]

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
            : <div>
                <Loader/>
                <Dialog
                  modal={false}
                  actions={actions}
                  open={this.state.showErrorDialog}
                  onRequestClose={() => { this.setState({showErrorDialog: false})}}
                > { formatMessage({id: 'error_unable_to_load_stop'})}
                </Dialog>
            </div>
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
