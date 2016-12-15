import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'
import NewStopMarker from './NewStopMarker'
import { Link, browserHistory } from 'react-router'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import stopTypes from './stopTypes'

class MarkerList extends React.Component {

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

  handleUpdatePathLink(coords, quayIndex) {
    if (this.props.isCreatingPolylines && this.props.polylineStartQuay.quayIndex == quayIndex) {
      this.props.dispatch(UserActions.removeLastPolyline())
    }
    else if (this.props.isCreatingPolylines) {
      this.props.dispatch(UserActions.addFinalCoordinesToPolylines(coords, quayIndex))
    } else {
      this.props.dispatch(UserActions.startCreatingPolyline(coords, quayIndex))
    }
  }

  render() {

    const { stops, handleDragEnd, changeCoordinates, dragableMarkers } = this.props
    const { formatMessage, locale } = this.props.intl

    let popupMarkers = []

    const CustomPopupMarkerText = {
      untitled: formatMessage({id: 'untitled'}),
      coordinates: formatMessage({id: 'coordinates'})
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

      const quays = markerProps.quays

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
            active={active}
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
                  text={newStopMarkerText}
                  compassBearing={quay.compassBearing}
                  quayName={quay.name}
                  handleUpdatePathLink={this.handleUpdatePathLink.bind(this)}
                  handleOnClick={() => { this.handleQuayOnClick(quay.id) } }
                />)
            })
        }
      }
    })

    return <div>{popupMarkers}</div>
  }

}

MarkerList.propTypes = {
  stops: PropTypes.array.isRequired,
  handleDragEnd: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    path: state.userReducer.path,
    polylineStartQuay: state.editStopReducer.polylineStartQuay,
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
