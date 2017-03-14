import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { MapActions, UserActions } from '../actions/'
import stopTypes from '../components/stopTypes'
import { injectIntl } from 'react-intl'
import ConfirmDialog from '../components/ConfirmDialog'
import EditStopBoxTabs from './EditStopBoxTabs'
import { Tabs, Tab } from 'material-ui/Tabs'
import StopPlaceDetails from '../components/StopPlaceDetails'
import { withApollo } from 'react-apollo'
import mapToMutationVariables from '../modelUtils/mapToQueryVariables'
import { mutateStopPlace, mutatePathLink } from '../actions/Mutations'
import * as types from '../actions/Types'
import EditStopAdditional from './EditStopAdditional'
import MdUndo from 'material-ui/svg-icons/content/undo'
import MdSave from 'material-ui/svg-icons/content/save'
import MdBack from 'material-ui/svg-icons/navigation/arrow-back'
import MdMore from 'material-ui/svg-icons/navigation/more-vert'
import MdLess from 'material-ui/svg-icons/navigation/expand-less'
import Divider from 'material-ui/Divider'


class EditStopGeneral extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDialogOpen: false,
      allowPathLinkAdjustmentsDialog: false,
    }
  }

  handleSave() {

    const { pathLink, stopPlace, stopHasBeenModified } = this.props

    let shouldShowDialog = false

    if (!stopHasBeenModified) {
      this.handleSaveStopAndPathLink()
      return
    }

    pathLink.forEach( p => {
      if (p.from) {
        if (p.from.quay.geometry.coordinates) {
          const quay = stopPlace.quays.filter( q => q.id == p.from.quay.id)
          if (quay.length && JSON.stringify(quay[0].location) !== JSON.stringify(p.from.quay.geometry.coordinates[0])) {
            shouldShowDialog = true
          }
        }
        if (p.to.quay.geometry.coordinates) {
          const quay = stopPlace.quays.filter( q => q.id == p.to.quay.id)
          if (quay.length && JSON.stringify(quay[0].location) !== JSON.stringify(p.to.quay.geometry.coordinates[0])) {
            shouldShowDialog = true
          }
        }
      }
    })

    if (shouldShowDialog) {
      this.setState({
        allowPathLinkAdjustmentsDialog: true
      })
    } else {
      this.handleSaveStopAndPathLink()
    }
  }

  handleSaveStopAndPathLink() {
    const stopPlaceVariables = mapToMutationVariables.mapStopToVariables(this.props.stopPlace)
    const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(this.props.pathLink)

    this.setState({
      allowPathLinkAdjustmentsDialog: false
    })

    const { client, dispatch } = this.props
    client.mutate({ variables: stopPlaceVariables, mutation: mutateStopPlace}).then( result => {
      if (result.data.mutateStopPlace[0].id) {
        dispatch( UserActions.navigateTo('/edit/', result.data.mutateStopPlace[0].id))
      }
    }).then( result => {

      if (pathLinkVariables && pathLinkVariables.length) {

        client.mutate({ variables: { "PathLink": pathLinkVariables }, mutation: mutatePathLink}).then( result => {
          dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS) )
        }).catch( err => {
          dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED, types.ERROR) )
        })
      } else {
        dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS) )
      }
    })
  }

  handleGoBack() {
    this.props.dispatch(UserActions.navigateTo('/', ''))
  }

  handleDiscardChanges() {
    this.setState({
      confirmDialogOpen: false
    })
    this.props.dispatch(MapActions.discardChangesForEditingStop())
  }

  handleSlideChange(value) {
    this.props.dispatch(UserActions.changeElementTypeTab(value))
  }

  showMoreStopPlace() {
    this.props.dispatch(UserActions.showEditStopAdditional())
  }

  showLessStopPlace = () => {
    this.props.dispatch(UserActions.hideEditStopAdditional())
  }

  handleDialogClose() {
    this.setState({
      confirmDialogOpen: false,
      allowPathLinkAdjustmentsDialog: false
    })
  }

  getTitleText = (stopPlace, formatMessage) => {
    return (stopPlace && stopPlace.id)
      ? `${formatMessage({id: 'editing'})} ${stopPlace.name}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
      : formatMessage({id: 'new_stop_title'})
  }

  getQuayItemName = (locale, stopPlace) => {
    stopTypes[locale].forEach(stopType => {
      if (stopType.value === stopPlace.stopPlaceType) {
        return stopType.quayItemName
      }
    })
  }


  render() {

    const { stopPlace, stopHasBeenModified, activeElementTab, intl, showEditStopAdditional } = this.props
    const { formatMessage, locale } = intl

    if (!stopPlace) return null

    const translations = {
      name: formatMessage({id: 'name'}),
      publicCode: formatMessage({id: 'publicCode'}),
      description: formatMessage({id: 'description'}),
      unsaved: formatMessage({id: 'unsaved'}),
      undefined: formatMessage({id: 'undefined'}),
      none: formatMessage({id: 'none_no'}),
      quays: formatMessage({id: 'quays'}),
      pathJunctions: formatMessage({id: 'pathJunctions'}),
      entrances: formatMessage({id: 'entrances'}),
      quayItemName: this.getQuayItemName(locale, stopPlace),
      capacity: formatMessage({id: 'capacity'}),
      parking: formatMessage({id: 'parking'}),
      elements: formatMessage({id: 'elements'})
    }

    const captionText = this.getTitleText(stopPlace, formatMessage)

    const style = {
      border: '1px solid #511E12',
      background: '#fff',
      width: 405,
      marginTop: 2,
      position: 'absolute',
      zIndex: 999,
    }

    const scrollable = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      width: '100%',
      height: '78vh',
      position: 'relative',
      display: 'block',
      zIndex: 999,
      marginTop: 2
    }

    const stopBoxBar = { color: '#fff', background: '#2c2c2c', fontSize: 12, padding: 2}
    const tabStyle = { color: '#000', fontSize: 10, fontWeight: 600 }

    return (

      <div style={style}>
        <div style={stopBoxBar}>{ captionText }</div>
        <div style={scrollable}>
          <div style={{padding: '10 5'}}>
            <StopPlaceDetails
              intl={intl}
              expanded={showEditStopAdditional}
              showLessStopPlace={this.showLessStopPlace.bind(this)}
              showMoreStopPlace={this.showMoreStopPlace.bind(this)}
            />
            { showEditStopAdditional
              ? <EditStopAdditional/>
              : null
            }
            <div style={{textAlign: 'center', marginBottom: 5}}>
              { showEditStopAdditional
                ? <FlatButton
                  icon={<MdLess/>}
                  onClick={() => this.showLessStopPlace()}
                />
                :
                <FlatButton
                  icon={<MdMore/>}
                  onClick={() => this.showMoreStopPlace()}
                />
              }
            </div>
            <Divider inset={true}/>
            <Tabs
              onChange={this.handleSlideChange.bind(this)}
              value={activeElementTab}
              tabItemContainerStyle={{backgroundColor: '#fff'}}
            >
              <Tab style={tabStyle} label={`${formatMessage({id: 'quays'})} (${stopPlace.quays.length})`} value={0} />
              <Tab style={tabStyle} label={`${formatMessage({id: 'navigation'})} (${stopPlace.pathJunctions.length + stopPlace.entrances.length})`} value={1} />
              <Tab style={tabStyle} label={`${formatMessage({id: 'parking'})} (${stopPlace.parking.length})`} value={2} />
            </Tabs>
            <EditStopBoxTabs activeStopPlace={stopPlace} itemTranslation={translations}/>
          </div>
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
          <ConfirmDialog
            open={this.state.allowPathLinkAdjustmentsDialog}
            handleClose={ () => { this.handleDialogClose() }}
            handleConfirm={ () => { this.handleSaveStopAndPathLink() }}
            messagesById={{
              title: 'quay_adjustments_title',
              body: 'quay_adjustments_body',
              confirm: 'quay_adjustments_confirm',
              cancel: 'quay_adjustments_cancel',
            }}
            intl={intl}
          />
        </div>
        <div style={{border: "1px solid #efeeef", textAlign: 'right', width: '100%', display: 'flex', justifyContent: 'space-around'}}>
          { stopHasBeenModified
            ?
            <FlatButton
              icon={<MdUndo/>}
              label={formatMessage({id: 'undo_changes'})}
              style={{margin: '8 5', zIndex: 999}}
              labelStyle={{fontSize: '0.8em'}}
              onClick={ () => { this.setState({confirmDialogOpen: true })} }
            />
            :
            <FlatButton
              icon={<MdBack/>}
              label={formatMessage({id: 'go_back'})}
              style={{margin: '8 5', zIndex: 999}}
              labelStyle={{fontSize: '0.8em'}}
              onClick={this.handleGoBack.bind(this)}
            />
          }
          <FlatButton
            icon={<MdSave/>}
            label={formatMessage({id: 'save'})}
            style={{margin: '8 5', zIndex: 999}}
            labelStyle={{fontSize: '0.8em'}}
            onClick={this.handleSave.bind(this)}
          />
        </div>
      </div> )
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current,
  pathLink: state.stopPlace.pathLink,
  stopHasBeenModified: state.stopPlace.stopHasBeenModified,
  isMultiPolylinesEnabled: state.editingStop.enablePolylines,
  activeElementTab: state.user.activeElementTab,
  showEditQuayAdditional: state.user.showEditQuayAdditional,
  showEditStopAdditional: state.user.showEditStopAdditional
})

export default withApollo(injectIntl(connect(mapStateToProps)(EditStopGeneral)))
