import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import QuayItem from '../components/QuayItem'
import PathJunctionItem from '../components/PathJunctionItem'
import EntranceItem from '../components/EntranceItem'
import RaisedButton from 'material-ui/RaisedButton'
import { MapActions,  AjaxActions, UserActions } from '../actions/'
import TextField from 'material-ui/TextField'
import stopTypes from '../components/stopTypes'
import MenuItem from 'material-ui/MenuItem'
import { injectIntl } from 'react-intl'
import ModalityIcon from '../components/ModalityIcon'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import {Tabs, Tab} from 'material-ui/Tabs'

class EditStopBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stopTypeOpen: false,
      slideIndex: 0
    }
  }

  handleRemoveQuay(index) {
    this.props.dispatch(MapActions.removeQuay(index))
  }

  handleSave() {
    if (window.location.pathname.indexOf('new_stop') > 0) {
      this.props.dispatch(AjaxActions.saveNewStop())
    } else {
      this.props.dispatch(AjaxActions.saveEditingStop())
    }
  }

  handleStopNameChange(event) {
    this.props.dispatch(MapActions.changeStopName(event.target.value))
  }

  handleStopDescriptionChange(event) {
    this.props.dispatch(MapActions.changeStopDescription(event.target.value))
  }

  handleStopTypeChange(value) {
    this.handleCloseStopPlaceTypePopover()
    this.props.dispatch(MapActions.changeStopType(value))
  }

  handleGoBack() {
    this.props.dispatch(UserActions.navigateTo('/', ''))
  }

  handleDiscardChanges() {
    this.props.dispatch(MapActions.discardChangesForEditingStop())
  }

  handleOpenStopPlaceTypePopover(event) {
    this.setState({
      ...this.state,
      stopTypeOpen: true,
      anchorEl: event.currentTarget
    })
  }

  handleCloseStopPlaceTypePopover() {
    this.setState({
      ...this.state,
      stopTypeOpen: false
    })
  }

  handleSlideChange(value) {
    this.setState({
      ...this.state,
      slideIndex: value
    })
  }

  render() {

    const { activeStopPlace, hasContentChanged } = this.props
    const { formatMessage, locale } = this.props.intl

    if (!activeStopPlace) return (
      <div>
        <span style={{ margin: 20, color: "red"}}>
          {formatMessage({id: 'something_went_wrong'})}
        </span>
      </div>
    )

    let quayItemName = null

    stopTypes[locale].forEach( (stopType) => {
      if (stopType.value === activeStopPlace.markerProps.stopPlaceType) {
        quayItemName = stopType.quayItemName
      }
    })

    let captionText = formatMessage({id: 'new_stop_title'})

    if (activeStopPlace && activeStopPlace.markerProps.id) {
      captionText = `${formatMessage({id: 'editing'})} ${activeStopPlace.markerProps.name} (${activeStopPlace.markerProps.id})`
    }

    let itemTranslation = {
      name: formatMessage({id: 'name'}),
      description: formatMessage({id: 'description'}),
      allAreasWheelchairAccessible: formatMessage({id: 'all_areas_wheelchair_accessible'}),
      unsaved: formatMessage({id: 'unsaved'}),
      undefined: formatMessage({id: 'undefined'})
    }

    if (quayItemName !== null) {
      itemTranslation.quayItemName = formatMessage({id: quayItemName || 'name'})
    }

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const tabContainerStyle = {
      height: 220,
      position: "relative",
      display: "block",
      marginTop: -70
    }

    const SbStyle = {
      top: 80,
      border: '1px solid #511E12',
      background: '#fff',
      width: 410,
      margin: 0,
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

    let stopPlaceType = activeStopPlace.markerProps.stopPlaceType

    return (

      <div style={SbStyle} ref="c">
        <div style={stopBoxBar}>{captionText}</div>
        <div style={fixedHeader}>
          <TextField
            hintText={formatMessage({id: 'name'})}
            floatingLabelText={formatMessage({id: 'name'})}
            style={{width: 350, marginTop: -20}}
            value={activeStopPlace.markerProps.name}
            onChange={e => typeof e.target.value === 'string' && this.handleStopNameChange(e)}
          />
          <IconButton
            style={{float: 'right'}}
            onClick={(e) => { this.handleOpenStopPlaceTypePopover(e) }}
          >
            <ModalityIcon
              type={stopPlaceType}
            />
          </IconButton>
          <Popover
            open={this.state.stopTypeOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleCloseStopPlaceTypePopover.bind(this)}
            animation={PopoverAnimationVertical}
          >
            { stopTypes[locale].map( (type, index) =>
              <MenuItem
                key={'stopType' + index}
                value={type.value}
                style={{padding: '0px 10px'}}
                primaryText={type.name}
                onClick={() => { this.handleStopTypeChange(type.value) }}
                secondaryText={(
                  <ModalityIcon
                    iconStyle={{float: 'left', marginLeft: -18, marginTop: 9}}
                    type={type.value}
                  />)}
              />
            ) }
          </Popover>
          <TextField
            hintText={formatMessage({id: 'description'})}
            floatingLabelText={formatMessage({id: 'description'})}
            style={{width: 350, marginTop: -20}}
            value={activeStopPlace.markerProps.description}
            onChange={e => typeof e.target.value === 'string' && this.handleStopDescriptionChange(e)}
          />
        </div>
        <div style={{fontWeight: 600, marginTop: 5}}>

        </div>
        <Tabs
          onChange={this.handleSlideChange.bind(this)}
          value={this.state.slideIndex}
          tabItemContainerStyle={{backgroundColor: '#fff', marginTop: -5}}
        >
          <Tab style={tabStyle} label={`${formatMessage({id: 'quays'})} (${activeStopPlace.markerProps.quays.length})`} value={0} />
          <Tab style={tabStyle} label={`${formatMessage({id: 'pathJunctions'})} (${activeStopPlace.markerProps.pathJunctions.length})`} value={1} />
          <Tab style={tabStyle} label={`${formatMessage({id: 'entrances'})} (${activeStopPlace.markerProps.entrances.length})`} value={2} />
        </Tabs>
        <div style={scrollable}>
            <div style={tabContainerStyle}>
            { this.state.slideIndex === 0 && activeStopPlace.markerProps.quays.map( (quay,index) =>
              <QuayItem
                translations={itemTranslation}
                key={"quay-" + index}
                quay={quay}
                ref={'quay-' + index}
                index={index}
                name={quay.name}
                removeQuay={() => this.handleRemoveQuay(index)}
              />
            )}
            { this.state.slideIndex === 1 && activeStopPlace.markerProps.pathJunctions.map( (pathJunction,index) =>
              <PathJunctionItem
                translations={itemTranslation}
                pathJunction={pathJunction}
                key={"pathJunction-" + index}
                name=""
              />
            )}
            { this.state.slideIndex === 2 && activeStopPlace.markerProps.entrances.map( (entrance,index) =>
              <EntranceItem
                translations={itemTranslation}
                key={"entrance-" + index}
                entrance={entrance}
                name=""
              />
            )}
          </div>
        </div>
        <div style={{border: "1px solid #efeeef", textAlign: 'right', width: '100%'}}>
          { hasContentChanged
            ? <RaisedButton
            secondary={true}
            label={formatMessage({id: 'undo_changes'})}
            style={{margin: '8 5', zIndex: 999}}
            onClick={this.handleDiscardChanges.bind(this)}
          />
            : <RaisedButton
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

const mapStateToProps = (state, ownProps) => {
  return {
    activeStopPlace: state.editStopReducer.activeStopPlace,
    isLoading: state.editStopReducer.activeStopIsLoading,
    hasContentChanged: state.editStopReducer.editedStopChanged,
    isMultiPolylinesEnabled: state.editStopReducer.enablePolylines
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStopBox))
