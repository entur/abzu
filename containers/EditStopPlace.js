import { connect } from 'react-redux'
import React, { PropTypes } from 'react'
import Loader from '../components/Loader'
import EditStopMap from './EditStopMap'
import EditStopGeneral from './EditStopGeneral'
import InformationBanner from '../components/InformationBanner'
import Information from '../config/information'
import { injectIntl } from 'react-intl'
import InformationManager from '../singletons/InformationManager'
import { stopPlaceAndPathLink } from "../actions/Queries"
import { withApollo } from 'react-apollo'
import '../styles/main.css'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { UserActions } from '../actions/'
import EditStopSideBar from './EditStopSideBar'
import rolesParser from '../roles/rolesParser'

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
       fetchPolicy: 'network-only',
        query: stopPlaceAndPathLink,
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

    let { isCreatingPolylines, stopPlace, kc } = this.props
    const { locale, formatMessage } = this.props.intl

    const actions = [
      <FlatButton
        label={formatMessage({id: 'cancel'})}
        onTouchTap={this.handleCloseErrorDialog.bind(this)}
      />,
    ]

    const shouldDisplayMessage  = (isCreatingPolylines && new InformationManager().getShouldPathLinkBeDisplayed())

    const disabled = !rolesParser.canEdit(kc.tokenParsed)

    return (
      <div>
        <Dialog
          modal={false}
          actions={actions}
          open={this.state.showErrorDialog}
          onRequestClose={() => { this.setState({showErrorDialog: false})}}
        > { formatMessage({id: 'error_unable_to_load_stop'})}
        </Dialog>
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
              <EditStopGeneral disabled={disabled}/>
              <EditStopMap disabled={disabled}/>
              <EditStopSideBar disabled={disabled}/>
            </div>
            : <Loader/>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  stopPlace: state.stopPlace.current || state.stopPlace.newStop,
  kc: state.user.kc
})

const EditStopPlaceWithIntl = injectIntl(connect(mapStateToProps)(EditStopPlace))

export default withApollo(EditStopPlaceWithIntl)
