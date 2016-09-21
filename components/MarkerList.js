import React, { Component, PropTypes } from 'react'
import CustomPopupMarker from './CustomPopupMarker'
import { Link, browserHistory } from 'react-router'
import { MapActions, AjaxActions, UserActions } from '../actions/'
import { connect } from 'react-redux'

class MarkerList extends React.Component {

  handleQuayOnClick(id) {
    console.log("Quay clicked", id)
  }

  handleStopOnClick(id) {

    const { path } = this.props

    if (path !== id) {
      this.props.dispatch(UserActions.navigateTo('/edit/', id))
      this.props.dispatch(AjaxActions.getStop(id))
    }
  }

  render() {

    const { stops, handleDragEnd } = this.props

    let popupMarkers = []

    stops.forEach(({ text, key, markerProps }, stopIndex) => {

      const quays = markerProps.quays

      popupMarkers.push((
        <CustomPopupMarker
          key={"custom-parent- " + stopIndex}
          markerIndex={-1}
          stopIndex={stopIndex}
          position={markerProps.position}
          children={text}
          handleDragEnd={handleDragEnd}
          handleOnClick={() => { this.handleStopOnClick(markerProps.id)} }
        />
      ))

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
                children={text}
                handleDragEnd={handleDragEnd}
                handleOnClick={() => { this.handleQuayOnClick(quay.id) } }
              />)
          })
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkerList)
