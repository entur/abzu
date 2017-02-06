import React, { PropTypes } from 'react'
import StopPlaceMarker from './StopPlaceMarker'
import NewStopMarker from './NewStopMarker'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import stopTypes from './stopTypes'
import JunctionMarker from './JunctionMarker'
import { setDecimalPrecision } from '../utils'
import QuayMarker from './QuayMarker'
import { browserHistory } from 'react-router'

class MarkerList extends React.Component {

  static PropTypes = {
    stops: PropTypes.array.isRequired,
    handleDragEnd: PropTypes.func.isRequired
  }

  handleStopOnClick(id) {
    const { path } = this.props
    const isAlreadyActive = path === id
    if (id && !isAlreadyActive) {
      browserHistory.push('edit/' + id)
    }
  }

  handleNewStopClick() {
    browserHistory.push('edit/new')
  }

  handleDragEndNewStop(event) {
    this.props.dispatch(MapActions.createNewStop(event.target.getLatLng()))
  }

  handleFetchQuaysForNeighbourStop(id) {
    this.props.dispatch(AjaxActions.fetchQuaysForNeighourStop(id))
  }

  handleHideQuaysForNeighbourStop(id) {
    this.props.dispatch(UserActions.hideQuaysForNeighbourStop(id))
  }

  handleUpdatePathLink(coords, index, type) {
    const { isCreatingPolylines, polylineStartPoint, activeMap } = this.props

    if (activeMap) activeMap.closePopup()

    if (isCreatingPolylines && polylineStartPoint.type === type && polylineStartPoint.index == index) {
      this.props.dispatch(UserActions.removeLastPolyline())
    }
    else if (isCreatingPolylines) {
      this.props.dispatch(UserActions.addFinalCoordinesToPolylines(coords, index, type))
    } else {
      this.props.dispatch(UserActions.startCreatingPolyline(coords, index, type))
    }
  }

  handleJunctionDragEnd(index, type, event) {
    const position = event.target.getLatLng()

    let formattedPosition = {
      lat: setDecimalPrecision(position.lat, 6),
      lng: setDecimalPrecision(position.lng, 6)
    }

    this.props.dispatch( MapActions.changeJunctionPosition(index, type, formattedPosition))
  }

  handleQuayDragEnd(index, event) {
    const position = event.target.getLatLng()

    let formattedPosition = {
      lat: setDecimalPrecision(position.lat,6),
      lng: setDecimalPrecision(position.lng,6)
    }
    this.props.dispatch(MapActions.changeQuayPosition(index, formattedPosition))
  }

  render() {

    const { stops, handleDragEnd, changeCoordinates, dragableMarkers, neighbouringMarkersQuaysMap, missingCoordinatesMap, handleSetCompassBearing } = this.props
    const { formatMessage } = this.props.intl

    let popupMarkers = []

    const CustomPopupMarkerText = {
      untitled: formatMessage({id: 'untitled'}),
      coordinates: formatMessage({id: 'coordinates'}),
      createPathLinkHere: formatMessage({id: 'create_path_link_here'}),
      terminatePathLinkHere: formatMessage({id: 'terminate_path_link_here'}),
      cancelPathLink: formatMessage({id: 'cancel_path_link'}),
      showQuays: formatMessage({id: 'show_quays'}),
      hideQuays: formatMessage({id: 'hide_quays'})
    }

    const newStopMarkerText = {
      newStopTitle: formatMessage({id: 'new_stop_title'}),
      newStopQuestion: formatMessage({id: 'new_stop_question'}),
      createNow: formatMessage({id: 'create_now'})
    }

    stops.forEach( (stop, stopIndex) => {

      /*
      if (!markerProps.position) {
        if (missingCoordinatesMap[markerProps.id]) {
          markerProps.position = missingCoordinatesMap[markerProps.id]
        } else {
          return
        }
      } */

      const localeStopType = getLocaleStopTypeName(stop.stopPlaceType, this.props.intl)

      if (!stop.id) {
        popupMarkers.push(
          <NewStopMarker
              key={"newstop-parent- " + stopIndex}
              position={stop.location}
              handleDragEnd={this.handleDragEndNewStop.bind(this)}
              text={newStopMarkerText}
              handleOnClick={() => { this.handleNewStopClick(stop.location)}}
            />
        )

      } else {
        popupMarkers.push(
          (<StopPlaceMarker
            key={"stop-place" + stop.id}
            id={stop.id}
            index={stopIndex}
            position={stop.location}
            name={stop.name}
            formattedStopType={localeStopType}
            handleDragEnd={handleDragEnd}
            active={!!stop.isActive}
            stopType={stop.stopPlaceType}
            draggable={dragableMarkers}
            handleChangeCoordinates={changeCoordinates}
            translations={CustomPopupMarkerText}
            handleOnClick={() => { this.handleStopOnClick(stop.id)} }
            handleFetchQuaysForNeighbourStop={this.handleFetchQuaysForNeighbourStop.bind(this)}
            neighbouringMarkersQuaysMap={neighbouringMarkersQuaysMap}
            handleHideQuaysForNeighbourStop={this.handleHideQuaysForNeighbourStop.bind(this)}
            isEditingStop={this.props.isEditingStop}
            />
          )
        )

        if (stop.quays) {
           stop.quays.toArray().forEach( (quay, index) => {
              popupMarkers.push(
                <QuayMarker
                  index={index}
                  parentId={stopIndex}
                  position={quay.location}
                  key={"quay" + quay.id || index}
                  handleQuayDragEnd={this.handleQuayDragEnd.bind(this)}
                  translations={Object.assign({}, newStopMarkerText, CustomPopupMarkerText)}
                  compassBearing={quay.compassBearing}
                  name={quay.name || ''}
                  parentStopPlaceName={stop.name}
                  formattedStopType={localeStopType}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  handleChangeCoordinates={changeCoordinates}
                  draggable
                  belongsToNeighbourStop={!stop.isActive}
                  handleSetCompassBearing={handleSetCompassBearing}
                />)
            })
        }

        if (stop.entrances) {

          const junctionMarkerText = {
            junctionTitle: formatMessage({id: 'entrance'})
          }

          stop.entrances.forEach( (entrance, index) => {
            popupMarkers.push(
              <JunctionMarker
                position={[entrance.centroid.location.latitude,
                  entrance.centroid.location.longitude
                ]}
                index={index}
                key={'entrance-'+index}
                type="entrance"
                handleDragEnd={this.handleJunctionDragEnd.bind(this)}
                handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                text={Object.assign({}, junctionMarkerText, CustomPopupMarkerText)}
                name={entrance.name}
              />
            )
          })
        }

        if (stop.pathJunctions) {

          const junctionMarkerText = {
            junctionTitle: formatMessage({id: 'pathJunction'})
          }

          stop.pathJunctions.forEach( (pathJunction, index) => {
            popupMarkers.push(
              <JunctionMarker
                position={[pathJunction.centroid.location.latitude,
                  pathJunction.centroid.location.longitude
                ]}
                key={'pathjunction-'+index}
                index={index}
                type="pathJunction"
                handleDragEnd={this.handleJunctionDragEnd.bind(this)}
                handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                text={Object.assign({}, junctionMarkerText, CustomPopupMarkerText)}
                name={pathJunction.name}
              />
            )
          })
        }
      }
    })

    return <div>{popupMarkers}</div>
  }
}

const mapStateToProps = state => {
  return {
    path: state.user.path,
    polylineStartPoint: state.editingStop.polylineStartPoint,
    isCreatingPolylines: state.editingStop.isCreatingPolylines,
    neighbouringMarkersQuaysMap: state.editingStop.neighbouringMarkersQuaysMap,
    isEditingStop: state.routing.locationBeforeTransitions.pathname.indexOf('edit') > -1,
    missingCoordinatesMap: state.user.missingCoordsMap,
    activeMap: state.editingStop.activeMap
  }
}

const getLocaleStopTypeName = (stopPlaceType, intl) => {
  const { formatMessage, locale } = intl
  let formattedStopTypeId = null
  stopTypes[locale].forEach( (stopType) => {
    if (stopType.value === stopPlaceType) {
      formattedStopTypeId = stopType.quayItemName
    }
  })
  return formattedStopTypeId ? formatMessage({id: formattedStopTypeId || 'name'}) : ''
}

export default injectIntl(connect(mapStateToProps)(MarkerList))
