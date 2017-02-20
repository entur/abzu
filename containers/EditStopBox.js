import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { MapActions, UserActions } from '../actions/'
import stopTypes from '../components/stopTypes'
import { injectIntl } from 'react-intl'
import ConfirmDialog from '../components/ConfirmDialog'
import EditStopBoxTabs from './EditStopBoxTabs'
import { Tabs, Tab } from 'material-ui/Tabs'
import EditStopBoxHeader from '../components/EditStopBoxHeader'
import { withApollo } from 'react-apollo'
import mapToSchema from '../modelUtils/mapToSchema'
import { mutateStopPlace } from '../actions/Queries'
import * as types from '../actions/actionTypes'

class EditStopBox extends React.Component {

  constructor(props) {
    super(props)

    const { formatMessage } = props.intl

    this.state = {
      confirmDialogOpen: false,
      itemTranslation:  {
        name: formatMessage({id: 'name'}),
        publicCode: formatMessage({id: 'publicCode'}),
        description: formatMessage({id: 'description'}),
        unsaved: formatMessage({id: 'unsaved'}),
        undefined: formatMessage({id: 'undefined'}),
        none: formatMessage({id: 'none_no'}),
        quays: formatMessage({id: 'quays'}),
        pathJunctions: formatMessage({id: 'pathJunctions'}),
        entrances: formatMessage({id: 'entrances'}),
      }

    }
  }

  handleSave() {
    const mappedToSchema = mapToSchema.mapStopToSchema(this.props.stopPlace)
    const { client, dispatch } = this.props
    client.mutate({ variables: mappedToSchema, mutation: mutateStopPlace}).then( result => {
      if (result.data.mutateStopPlace[0].id) {
        dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED))
        dispatch( UserActions.navigateTo('/edit/', result.data.mutateStopPlace[0].id))
      }
    }).catch( err => {
      dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED))
      console.log(err)
    })
  }

  handleGoBack() {
    this.props.dispatch(UserActions.navigateTo('/', ''))
  }

  handleDiscardChanges() {
    this.setState({
      confirmDialogOpen: false
    })
    // TODO : do we want this?
    this.props.dispatch(MapActions.discardChangesForEditingStop())
  }

  handleSlideChange(value) {
    this.props.dispatch(UserActions.changeElementTypeTab(value))
  }

  handleDialogClose() {
    this.setState({
      confirmDialogOpen: false
    })
  }

  render() {

    const { stopPlace, hasContentChanged, activeElementTab, intl } = this.props
    const { itemTranslation } = this.state
    const { formatMessage, locale } = intl

    if (!stopPlace) return null

    let quayItemName = null

    stopTypes[locale].forEach(  stopType => {
      if (stopType.value === stopPlace.stopPlaceType) {
        quayItemName = stopType.quayItemName
      }
    })

    if (quayItemName !== null) {
      itemTranslation.quayItemName = formatMessage({id: quayItemName || 'name'})
    }

    let captionText = formatMessage({id: 'new_stop_title'})

    if (stopPlace && stopPlace.id) {
      captionText = `${formatMessage({id: 'editing'})} ${stopPlace.name}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
    }

    const SbStyle = {
      top: 80,
      border: '1px solid #511E12',
      background: '#fff',
      width: 410,
      margin: 10,
      position: 'absolute',
      zIndex: 999,
      padding: '10 5'
    }

    const scrollable = {
      overflowY: "auto",
      width: "100%",
      height: '40vh',
      position: "relative",
      display: "block",
      zIndex: 999,
      marginTop: 10
    }

    const stopBoxBar = {
      float: 'right',
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 5,
      top: -10,
      left: 5,
      position:'relative',
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontSize: '0.8em',
      fontWeight: '0.9em'
    }

    const tabStyle = {
      color: '#000',
      fontSize: '0.7em',
      fontWeight: 600,
      marginTop: -10
    }

    return (

      <div style={SbStyle}>
        <ConfirmDialog
          open={this.state.confirmDialogOpen}
          handleClose={ () => { this.handleDialogClose() }}
          handleConfirm={ () => { this.handleDiscardChanges() }}
          messagesById={{
            title: 'discard_changes_title',
            body: 'discard_changes_body',
            confirm: 'discard_changes_confirm',
            cancel: 'discard_changes_cancel',
          }}
          intl={intl}
        />
        <div style={stopBoxBar}>{captionText}</div>
          <EditStopBoxHeader intl={intl}/>
        <div style={{fontWeight: 600, marginTop: 5}}>
        </div>
        <Tabs
          onChange={this.handleSlideChange.bind(this)}
          value={activeElementTab}
          tabItemContainerStyle={{backgroundColor: '#fff', marginTop: -5}}
        >
          <Tab style={tabStyle} label={`${formatMessage({id: 'quays'})} (${stopPlace.quays.length})`} value={0} />
          <Tab style={tabStyle} label={`${formatMessage({id: 'pathJunctions'})} (${stopPlace.pathJunctions.length})`} value={1} />
          <Tab style={tabStyle} label={`${formatMessage({id: 'entrances'})} (${stopPlace.entrances.length})`} value={2} />
        </Tabs>
        <div style={scrollable}>
          <EditStopBoxTabs activeStopPlace={stopPlace} itemTranslation={itemTranslation}/>
        </div>
        <div style={{border: "1px solid #efeeef", textAlign: 'right', width: '100%'}}>
          { hasContentChanged
            ?
          <RaisedButton
            secondary={true}
            label={formatMessage({id: 'undo_changes'})}
            style={{margin: '8 5', zIndex: 999}}
            onClick={ () => { this.setState({confirmDialogOpen: true })} }
          />
            :
          <RaisedButton
            secondary={true}
            label={formatMessage({id: 'go_back'})}
            style={{margin: '8 5', zIndex: 999}}
            onClick={this.handleGoBack.bind(this)}
          />
          }
          <RaisedButton
            primary={true}
            label={formatMessage({id: 'save'})}
            style={{margin: '8 5', zIndex: 999}}
            onClick={this.handleSave.bind(this)}
          />
        </div>
      </div> )
  }
}

const mapStateToProps = state => ({
    stopPlace: state.stopPlace.current,
    hasContentChanged: state.editingStop.editedStopChanged, // TODO: Should this functionality be kept?
    isMultiPolylinesEnabled: state.editingStop.enablePolylines,
    activeElementTab: state.user.activeElementTab
})

export default withApollo(injectIntl(connect(mapStateToProps)(EditStopBox)))
