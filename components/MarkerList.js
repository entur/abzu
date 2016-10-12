import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'
import NewStopMarker from './NewStopMarker'
import { Link, browserHistory } from 'react-router'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

class MarkerList extends React.Component {

  handleStopOnClick(id) {
    const { path } = this.props
     // Prevent loading resource already loaded and being edited
    if (path && id && path !== id) {
      this.props.dispatch(UserActions.navigateTo('/edit/', id))
      this.props.dispatch(AjaxActions.getStop(id))
    }
  }

  handleNewStopClick(position) {
    this.props.dispatch( UserActions.navigateTo('/edit/', 'new_stop') )
  }

  render() {

    const { stops, handleDragEnd, changeCoordinates, dragableMarkers } = this.props
    const { formatMessage } = this.props.intl

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

    stops.forEach(({ text, key, markerProps, isNewStop }, stopIndex) => {

      if (!markerProps) return null

      const quays = markerProps.quays

      if (isNewStop) {
        popupMarkers.push(
          (<NewStopMarker
              key={"newstop-parent- " + stopIndex}
              position={markerProps.position}
              handleDragEnd={ () => {}}
              text={newStopMarkerText}
              handleOnClick={() => { this.handleNewStopClick(markerProps.position)}}
            />
          )
        )

      } else {
        popupMarkers.push(
          (<CustomPopupMarker
            key={"custom-parent- " + stopIndex}
            markerIndex={-1}
            stopIndex={stopIndex}
            position={markerProps.position}
            children={text}
            handleDragEnd={handleDragEnd}
            draggable={dragableMarkers}
            changeCoordinates={changeCoordinates}
            text={CustomPopupMarkerText}
            handleOnClick={() => { this.handleStopOnClick(markerProps.id)} }
            />
          )
        )

        if (quays) {

           quays.map( (quay, index) => {
              popupMarkers.push(
                <CustomPopupMarker
                  markerIndex={index}
                  stopIndex={stopIndex}
                  position={[quay.centroid.location.latitude,
                    quay.centroid.location.longitude
                  ]}
                  isQuay
                  key={"custom-" + stopIndex + "-" + index}
                  children={quay.name}
                  handleDragEnd={handleDragEnd}
                  changeCoordinates={changeCoordinates}
                  draggable={dragableMarkers}
                  text={newStopMarkerText}
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
    path: state.userReducer.path
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
