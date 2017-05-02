import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { StopPlaceActions, UserActions } from '../actions/'
import stopTypes from '../components/stopTypes'
import { injectIntl } from 'react-intl'
import ConfirmDialog from '../components/ConfirmDialog'
import EditStopBoxTabs from './EditStopBoxTabs'
import { Tabs, Tab } from 'material-ui/Tabs'
import StopPlaceDetails from '../components/StopPlaceDetails'
import { withApollo } from 'react-apollo'
import mapToMutationVariables from '../modelUtils/mapToQueryVariables'
import { mutateStopPlace, mutatePathLink } from '../actions/Mutations'
import { stopPlaceAndPathLinkByVersion, stopPlaceAllVersions } from '../actions/Queries'
import * as types from '../actions/Types'
import EditStopAdditional from './EditStopAdditional'
import MdUndo from 'material-ui/svg-icons/content/undo'
import MdSave from 'material-ui/svg-icons/content/save'
import MdBack from 'material-ui/svg-icons/navigation/arrow-back'
import MdMore from 'material-ui/svg-icons/navigation/more-vert'
import MdLess from 'material-ui/svg-icons/navigation/expand-less'
import Divider from 'material-ui/Divider'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import SaveDialog from '../components/SaveDialog'

class EditStopGeneral extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDialogOpen: false,
      saveDialogOpen: false,
      versionsOpen: false
    }
  }

  handleSave() {
    this.setState({
      saveDialogOpen: true
    })
  }

  handleSuccess(dispatch, id) {
    this.setState({
      saveDialogOpen: false
    })

    const { client } = this.props

    if (id) {

      client.query({
        fetchPolicy: 'network-only',
        query: stopPlaceAllVersions,
        variables: {
          id: id
        }
      })
    }

    dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_SAVED, types.SUCCESS) )
  }

  handleSaveStopAndPathLink(validBetween) {

    const stopPlaceVariables = mapToMutationVariables.mapStopToVariables(this.props.stopPlace, validBetween)
    const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(this.props.pathLink)
    let id = null

    const { client, dispatch } = this.props

    client.mutate({ variables: stopPlaceVariables, mutation: mutateStopPlace}).then( result => {
      if (result.data.mutateStopPlace[0].id) {
        id = result.data.mutateStopPlace[0].id
        dispatch( UserActions.navigateTo('/edit/', result.data.mutateStopPlace[0].id))
      }
    }).then( result => {

      if (pathLinkVariables && pathLinkVariables.length) {

        client.mutate({ variables: { "PathLink": pathLinkVariables }, mutation: mutatePathLink}).then( result => {
         this.handleSuccess(dispatch, id)
        }).catch( err => {
          dispatch( UserActions.openSnackbar(types.SNACKBAR_MESSAGE_FAILED, types.ERROR) )
        })
      } else {
        this.handleSuccess(dispatch, id)
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
    this.props.dispatch(StopPlaceActions.discardChangesForEditingStop())
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
      allowPathLinkAdjustmentsDialog: false,
      saveDialogOpen: false
    })
  }

  handleTouchTapVersions = event => {
    event.preventDefault()

    this.setState({
      versionsOpen: true,
      anchorEl: event.currentTarget,
    })
  }

  handleVersionOnTap = ({id, version}) => {
    this.setState({
      versionsOpen: false
    })

    const { client } = this.props

    client.query({
      fetchPolicy: 'network-only',
      query: stopPlaceAndPathLinkByVersion,
      variables: {
        id: id,
        version: version
      }
    })
  }

  getTitleText = (stopPlace, formatMessage) => {
    return (stopPlace && stopPlace.id)
      ? `${stopPlace.name}, ${stopPlace.parentTopographicPlace} (${stopPlace.id})`
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

    const { stopPlace, stopHasBeenModified, activeElementTab, intl, showEditStopAdditional, versions, disabled } = this.props
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
      elements: formatMessage({id: 'elements'}),
      versions: formatMessage({id: 'versions'}),
      validBetween: formatMessage({id: 'valid_between'}),
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
      marginTop: 2
    }

    const stopBoxBar = { color: '#fff', background: 'rgb(39, 58, 70)', fontSize: 12, padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}

    const tabStyle = { color: '#000', fontSize: 10, fontWeight: 600 }

    return (

      <div style={style}>
        <div style={stopBoxBar}>
          <div style={{display: 'flex', alignItems: 'center', color: '#fff'}}>
            <MdBack
              color="#fff"
              style={{cursor: 'pointer', marginRight: 2, transform: 'scale(0.8)'}}
              onClick={this.handleGoBack.bind(this)}
            />
            <div>{ captionText }</div>
            </div>
          <FlatButton
            label={translations.versions}
            disabled={!versions.length}
            labelStyle={{color: '#fff', fontSize: 10, borderBottom: '1px dotted #fff', color: '#fff', padding: 0}}
            style={{margin: 0, zIndex: 999}}
            onTouchTap={this.handleTouchTapVersions}
          />
          <Popover
            open={this.state.versionsOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.setState({versionsOpen: false})}
            animation={PopoverAnimationVertical}
          >
            <Menu
              menuItemStyle={{fontSize: 12}}
              autoWidth={true}
            >
              { versions.map( (version, i) => (
                <MenuItem
                  key={'version'+i}
                  primaryText={
                    <div style={{display: 'flex'}}>
                      <div style={{marginRight: 8, fontWeight: 600}}>{version.version}</div>
                      <div>{version.name}</div>
                    </div>
                  }
                  secondaryText={
                    <div
                      style={{transform: 'translateY(-14px)'}}
                    >{`${version.fromDate || 'N/A'} - ${version.toDate || 'N/A'}`}</div>
                  }
                  onTouchTap={() => this.handleVersionOnTap(version)}
                /> )) }
            </Menu>
          </Popover>
        </div>
        <div style={scrollable}>
          <div style={{padding: '10 5'}}>
            <StopPlaceDetails
              disabled={disabled}
              intl={intl}
              expanded={showEditStopAdditional}
              showLessStopPlace={this.showLessStopPlace.bind(this)}
              showMoreStopPlace={this.showMoreStopPlace.bind(this)}
            />
            { showEditStopAdditional
              ? <EditStopAdditional
                  disabled={disabled}
                />
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
            <EditStopBoxTabs
              disabled={disabled}
              activeStopPlace={stopPlace}
              itemTranslation={translations}
            />
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
          { (this.state.saveDialogOpen && !disabled) ?
            <SaveDialog
              open={this.state.saveDialogOpen}
              handleClose={ () => { this.handleDialogClose() }}
              handleConfirm={this.handleSaveStopAndPathLink.bind(this)}
              intl={intl}
            />
            : null
          }
        </div>
        <div style={{border: "1px solid #efeeef", textAlign: 'right', width: '100%', display: 'flex', justifyContent: 'space-around'}}>
          <FlatButton
            icon={<MdUndo/>}
            disabled={!stopHasBeenModified}
            label={formatMessage({id: 'undo_changes'})}
            style={{margin: '8 5', zIndex: 999}}
            labelStyle={{fontSize: '0.8em'}}
            onClick={ () => { this.setState({confirmDialogOpen: true })} }
          />
          <FlatButton
            icon={<MdSave/>}
            disabled={disabled || !stopHasBeenModified}
            label={formatMessage({id: 'save_new_version'})}
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
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  activeElementTab: state.user.activeElementTab,
  showEditQuayAdditional: state.user.showEditQuayAdditional,
  showEditStopAdditional: state.user.showEditStopAdditional,
  versions: state.stopPlace.versions,
})

export default withApollo(injectIntl(connect(mapStateToProps)(EditStopGeneral)))
