import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import LeafletMap from '../components/LeafletMap'
import { AjaxActions, MapActions, UserActions } from '../actions/'

class StopPlacesMap extends React.Component {

  handleClick(e, map) {
    const { isCreatingNewStop } = this.props

    if (isCreatingNewStop) {
      map.leafletElement.doubleClickZoom.disable()
      this.props.dispatch( MapActions.createNewStop(e.latlng) )
    } else {
      map.leafletElement.doubleClickZoom.enable()
    }

  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value))
  }

  handleDragEnd(marker, index) {
  }

  handleMapMoveEnd() {
  }

  render() {

    const { position, markers, zoom, newStopPlace } = this.props

    return (
      <LeafletMap
        position={position}
        markers={markers}
        newStopPlace={newStopPlace}
        zoom={zoom}
        onDoubleClick={this.handleClick.bind(this)}
        handleDragEnd={this.handleDragEnd}
        handleMapMoveEnd={this.handleMapMoveEnd}
        dragableMarkers={false}
        activeBaselayer={this.props.activeBaselayer}
        handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
        />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { centerPosition, activeMarkers, zoom, newStopPlace } = state.stopPlacesReducer
  const { isCreatingNewStop } = state.userReducer
  return {
    position: centerPosition,
    markers: activeMarkers,
    zoom: zoom,
    newStopPlace: newStopPlace,
    isCreatingNewStop: isCreatingNewStop,
    activeBaselayer: state.userReducer.activeBaselayer
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
)(StopPlacesMap)
