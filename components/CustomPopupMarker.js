import React, { PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import { connect } from 'react-redux'
import compassIcon from "../static/icons/compass.png"
import { MapActions } from '../actions/'
import CustomMarkerIcon, { getShortQuayName } from './CustomMarkerIcon'

class CustomPopupMarker extends React.Component {

  /* avoid rerendering markers if significant information to
     the marker in question has been changed */
  shouldComponentUpdate(nextProps, nextState) {

    if (!nextProps.active && (this.props.active == nextProps.active)) {
      // Prevent re-render of neighbouring stops
      return false
    }

    if (JSON.stringify(this.props.position) !== JSON.stringify(nextProps.position)) {
      return true
    }

    if (!nextProps.isQuay && ((this.props.stopType !== nextProps.stopType) || (this.props.children !== nextProps.children) ||
        (this.props.formattedStopType !== nextProps.formattedStopType))) {
      return true
    }

    if (this.props.isCreatingPolylines !== nextProps.isCreatingPolylines && nextProps.isQuay) {
      return true
    }

    if (this.props.compassBearing !== nextProps.compassBearing) {
      return true
    }

    if (getShortQuayName(this.props.quayName) !== getShortQuayName((nextProps.quayName))) {
      return true
    }

    if (nextProps.isQuay && this.props.focusedQuayIndex !== nextProps.focusedQuayIndex) {
      return true
    }

    if (nextProps.isQuay && this.props.isCompassBearingEnabled !== nextProps.isCompassBearingEnabled) {
      return true
    }

    return false
  }

  handleSetCompassBearing() {
    let value = prompt('Compass bearing, 0-360', this.props.compassBearing)

    if (value == null) return

    if (value => 0 && value <= 360) {
      this.props.dispatch(MapActions.changeQuayCompassBearing(this.props.markerIndex, value))
    } else {
      this.handleSetCompassBearing()
    }
  }

  render() {

    let { children, position, handleOnClick, handleDragEnd, isQuay, markerIndex, draggable,
          changeCoordinates, text, active, stopType, formattedStopType, handleUpdatePathLink,
          isCreatingPolylines, polylineStartPoint, compassBearing, quayName, focusedQuayIndex, isCompassBearingEnabled } = this.props

    if (!children && !children.length) {
      children = text.untitled
    }

    let divIconBody = (
      <CustomMarkerIcon
        markerIndex={markerIndex}
        isQuay={isQuay}
        stopType={stopType}
        active={active}
        compassBearing={compassBearing}
        quayName={quayName}
        shouldBeFocused={focusedQuayIndex === markerIndex}
        isCompassBearingEnabled={isCompassBearingEnabled}
        />
    )

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(divIconBody)
    let pathLinkText = isCreatingPolylines ? text.terminatePathLinkHere : text.createPathLinkHere

    if (isQuay && isCreatingPolylines && polylineStartPoint.type === 'quay' && polylineStartPoint.index == markerIndex) {
      pathLinkText = text.cancelPathLink
    }

    let icon = divIcon({html: divIconBodyMarkup})

    return (

      <Marker
        key={"key" + markerIndex}
        icon={icon}
        position={position}
        onDragend={(event) => { handleDragEnd(isQuay, markerIndex, event) }}
        draggable={draggable && active}
        >
        <Popup>
          <div>
            <span style={{fontWeight: 600, color: '#00bcd4', fontSize: '1.2em', cursor: 'pointer',
              marginBottom: 10, display: 'inline-block', width: '100%', textAlign: 'center', marginBottom: 15
            }}
            onClick={handleOnClick}
            >
              {children}
            </span>
            { isQuay
            ? <span
                style={{fontWeight: 600, textAlign: 'center', width: '100%', fontSize: '1.2em', marginTop: -2, display: 'inline-block', marginBottom: 5}}
              >{formattedStopType + " " + (quayName || 'N/A')}</span>
            : null
            }
            { !isQuay
              ? null
              : <div
                  style={{fontWeight: 600, marginBottom: 10, cursor: 'pointer', color: '#0068ff', width: '100%', display: 'inline-block', textAlign: 'center'}}
                  onClick={() => { handleUpdatePathLink(position, markerIndex, 'quay') }}
                >{ pathLinkText } </div>
            }
            <div
              id={"pmPosition" + markerIndex}
              style={{display: 'block', cursor: 'pointer', width: 'auto', textAlign: 'center'}}
              onClick={() => changeCoordinates && changeCoordinates(isQuay, markerIndex, position)}
              >
              <span style={{display: 'inline-block', textAlign: 'center', borderBottom: '1px dotted black', }}>
                {position[0]}
              </span>
              <span style={{display: 'inline-block', marginLeft: 3, borderBottom: '1px dotted black'}}>
                {position[1]}
              </span>
            </div>
              { isQuay
                  ? <div onClick={this.handleSetCompassBearing.bind(this)}><img style={{width: 20, height: 20}} src={compassIcon}/></div>
                  : null
              }
          </div>
        </Popup>
      </Marker>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    isCreatingPolylines: state.editStopReducer.isCreatingPolylines,
    polylineStartPoint: state.editStopReducer.polylineStartPoint,
    focusedQuayIndex: state.editStopReducer.focusedQuayIndex,
    isCompassBearingEnabled: state.editStopReducer.isCompassBearingEnabled
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomPopupMarker)
