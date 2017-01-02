import React, { PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'
import NewStopMarker from './NewStopMarker'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import stopTypes from './stopTypes'
import JunctionMarker from './JunctionMarker'
import { setDecimalPrecision } from '../utils'

class MarkerList extends React.Component {

  static PropTypes = {
    stops: PropTypes.array.isRequired,
    handleDragEnd: PropTypes.func.isRequired
  }

  handleStopOnClick(id) {
    const { path } = this.props
     // Prevent loading resource already loaded and being edited
    if (id && path !== id) {
      this.props.dispatch(UserActions.navigateTo('/edit/', id))
      this.props.dispatch(AjaxActions.getStop(id))
    }
  }

  handleNewStopClick() {
    this.props.dispatch( UserActions.navigateTo('/edit/', 'new_stop') )
  }

  handleDragEndNewStop(event) {
    this.props.dispatch(MapActions.createNewStop(event.target.getLatLng()))
  }

  handleUpdatePathLink(coords, index, type) {
    const { isCreatingPolylines, polylineStartPoint } = this.props

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

  render() {

    const { stops, handleDragEnd, changeCoordinates, dragableMarkers } = this.props
    const { formatMessage, locale } = this.props.intl

    let popupMarkers = []

    const CustomPopupMarkerText = {
      untitled: formatMessage({id: 'untitled'}),
      coordinates: formatMessage({id: 'coordinates'}),
      createPathLinkHere: formatMessage({id: 'create_path_link_here'}),
      terminatePathLinkHere: formatMessage({id: 'terminate_path_link_here'}),
      cancelPathLink: formatMessage({id: 'cancel_path_link'}),
    }

    const newStopMarkerText = {
      newStopTitle: formatMessage({id: 'new_stop_title'}),
      newStopQuestion: formatMessage({id: 'new_stop_question'}),
      createNow: formatMessage({id: 'create_now'})
    }

    stops.forEach(({ text, markerProps, isNewStop, active }, stopIndex) => {

      if (!markerProps || !markerProps.position) {
        return
      }

      let formattedStopTypeId = null
      let formattedStopType = null

      stopTypes[locale].forEach( (stopType) => {
       if (stopType.value === markerProps.stopPlaceType) {
         formattedStopTypeId = stopType.quayItemName
       }
      })

      formattedStopType = formattedStopTypeId ? formatMessage({id: formattedStopTypeId || 'name'}) : ''

      const { quays, pathJunctions, entrances } = markerProps

      if (isNewStop) {
        popupMarkers.push(
          (<NewStopMarker
              key={"newstop-parent- " + stopIndex}
              position={markerProps.position}
              handleDragEnd={this.handleDragEndNewStop.bind(this)}
              text={newStopMarkerText}
              handleOnClick={() => { this.handleNewStopClick(markerProps.position)}}
            />
          )
        )

      } else {
        popupMarkers.push(
          (<CustomPopupMarker
            key={"custom-parent- " + stopIndex}
            markerIndex={stopIndex + "--1"}
            stopIndex={stopIndex}
            position={markerProps.position}
            children={text}
            formattedStopType={formattedStopType}
            handleDragEnd={handleDragEnd}
            active={!!active}
            stopType={markerProps.stopPlaceType}
            draggable={dragableMarkers}
            changeCoordinates={changeCoordinates}
            text={CustomPopupMarkerText}
            handleOnClick={() => { this.handleStopOnClick(markerProps.id)} }
            />
          )
        )

        if (quays) {
           quays.forEach( (quay, index) => {
              popupMarkers.push(
                <CustomPopupMarker
                  markerIndex={index}
                  stopIndex={stopIndex}
                  position={[quay.centroid.location.latitude,
                    quay.centroid.location.longitude
                  ]}
                  isQuay
                  key={"quay-" + stopIndex + "-" + index}
                  children={text}
                  handleDragEnd={handleDragEnd}
                  active={active}
                  formattedStopType={formattedStopType}
                  changeCoordinates={changeCoordinates}
                  draggable={dragableMarkers}
                  text={Object.assign({}, newStopMarkerText, CustomPopupMarkerText)}
                  compassBearing={quay.compassBearing}
                  quayName={quay.name}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  handleOnClick={() => { this.handleQuayOnClick(quay.id) } }
                />)
            })
        }

        if (entrances) {

          const junctionMarkerText = {
            junctionTitle: formatMessage({id: 'entrance'})
          }

          entrances.forEach( (entrance, index) => {
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

        if (pathJunctions) {

          const junctionMarkerText = {
            junctionTitle: formatMessage({id: 'pathJunction'})
          }

          pathJunctions.forEach( (pathJunction, index) => {
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

const mapStateToProps = (state, ownProps) => {
  return {
    path: state.userReducer.path,
    polylineStartPoint: state.editStopReducer.polylineStartPoint,
    isCreatingPolylines: state.editStopReducer.isCreatingPolylines
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
)(MarkerList))
