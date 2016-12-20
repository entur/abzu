import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import { connect } from 'react-redux'

class JunctionMarker extends React.Component {

  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    index: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
    handleUpdatePathLink: PropTypes.func.isRequired,
    text: PropTypes.object.isRequired
  }

  render() {

    const { position, index, type, handleDragEnd, handleUpdatePathLink } = this.props
    const { text, isCreatingPolylines, polylineStartPoint } = this.props

    const iconURL = type === 'entrance'
      ? require("../static/icons/entrance-icon-2x.png")
      : require("../static/icons/junction-icon-2x.png")

    const icon = L.icon({
      iconUrl: iconURL,
      iconSize: [30, 45],
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16]
    })

    const updatePathinkStyle = {
      fontWeight: 600,
      marginBottom: 10,
      cursor: 'pointer',
      color: '#0068ff',
      width: '100%',
      display: 'inline-block',
      textAlign: 'center'
    }

    const titleStyle = {
      fontWeight: '600',
      textTransform: 'capitalize',
      textAlign: 'center',
      fontSize: '1.2em'
    }

    let pathLinkText = isCreatingPolylines ? text.terminatePathLinkHere : text.createPathLinkHere

    if (isCreatingPolylines && polylineStartPoint.type === type && polylineStartPoint.index == index) {
      pathLinkText = text.cancelPathLink
    }

    return (
      <Marker
        draggable={true}
        position={position}
        icon={icon}
        onDragend={(event) => { handleDragEnd(index, type, event) }}
      >
      <Popup>
        <div>
          <p style={titleStyle}>{text.junctionTitle}</p>
          <div
            style={updatePathinkStyle}
            onClick={() => { handleUpdatePathLink(position, index, type) }}
          >{pathLinkText}</div>
        </div>
      </Popup>

      </Marker>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isCreatingPolylines: state.editStopReducer.isCreatingPolylines,
    polylineStartPoint: state.editStopReducer.polylineStartPoint
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JunctionMarker)
