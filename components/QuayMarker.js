const markerIcon = require('../static/icons/quay-marker-background.png')
import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import { connect } from 'react-redux'
import { MapActions } from '../actions/'
import compassIcon from '../static/icons/compass.png'
import compassBearingIcon from '../static/icons/compass-bearing.png'

class QuayMarker extends React.PureComponent {

  static propTypes = {
    index: PropTypes.number.isRequired,
    parentId: PropTypes.number.isRequired,
    parentStopPlaceName: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(Number).isRequired,
    name: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    handleQuayDragEnd: PropTypes.func.isRequired,
    formattedStopType: PropTypes.string.isRequired,
    handleUpdatePathLink: PropTypes.func.isRequired,
    isCreatingPolylines: PropTypes.bool.isRequired,
    handleChangeCoordinates: PropTypes.func.isRequired,
    draggable: PropTypes.bool.isRequired,
    handleSetCompassBearing: PropTypes.func
  }

  render() {

    const { position, name, index, handleQuayDragEnd, parentStopPlaceName, formattedStopType, handleUpdatePathLink, translations, handleChangeCoordinates, belongsToNeighbourStop } = this.props
    const { isCreatingPolylines, polylineStartPoint } = this.props

    let pathLinkText = isCreatingPolylines ? translations.terminatePathLinkHere : translations.createPathLinkHere

    if (isCreatingPolylines && polylineStartPoint.type === 'quay' && polylineStartPoint.index == index) {
      pathLinkText = translations.cancelPathLink
    }

    const divBody = ReactDOM.renderToStaticMarkup(
      <QuayMarkerIcon
        index={index}
        name={name}
        focusedElement={this.props.focusedElement}
        compassBearing={this.props.compassBearing}
        isCompassBearingEnabled={this.props.isCompassBearingEnabled}
        belongsToNeighbourStop={belongsToNeighbourStop}
      />
    )

    let quayIcon = divIcon({html: divBody, iconAnchor: [42, 45], popupAnchor: [0, 0]})

    return (
        <Marker
          position={position}
          icon={quayIcon}
          draggable={!belongsToNeighbourStop && this.props.draggable}
          onDragend={(event) => { handleQuayDragEnd(index, event) }}
        >
          <Popup autoPan={false}>
            <div>
               <span className="quay-marker-title">
                 { parentStopPlaceName }
                </span>
                <span className="quay-marker-title" style={{marginTop: -2, marginBottom: 5, fontSize: '1em', color: '#191919'}}>{formattedStopType + " " + (name || 'N/A')}</span>
                <div
                  className='change-path-link'
                  onClick={() => { handleUpdatePathLink(position, index, 'quay') }}
                >
                  { pathLinkText }
                </div>
                <div
                  style={{display: 'block', cursor: 'pointer', width: 'auto', textAlign: 'center'}}
                  onClick={() => !belongsToNeighbourStop && handleChangeCoordinates(true, index, position)}
                >
                  <span style={{display: 'inline-block', textAlign: 'center', borderBottom: !belongsToNeighbourStop ? '1px dotted black' : 'none', }}>
                      {position[0]}
                  </span>
                  <span style={{display: 'inline-block', marginLeft: 3, borderBottom: !belongsToNeighbourStop ? '1px dotted black' : 'none'}}>
                    {position[1]}
                  </span>
                </div>
              { belongsToNeighbourStop
                ? null
                :  <div onClick={() => { this.props.handleSetCompassBearing(this.props.compassBearing, index) }}>
                    <img style={{width: 20, height: 22}} src={compassIcon}/>
                  </div>
              }
            </div>
          </Popup>
        </Marker>
      )
  }
}

class QuayMarkerIcon extends React.Component {

  render() {

    const { index, name, compassBearing, focusedElement, isCompassBearingEnabled, belongsToNeighbourStop } = this.props
    const quayShortName = getShortQuayName(name)
    const shouldBeFocused = (focusedElement.type === 'quay' && index === focusedElement.index)

    const quayStyle = {
      color: '#fff',
      position: 'absolute',
      top: 10,
      left: 36,
      fontSize: '0.8em',
      zIndex: 9999,
    }

    let markerIconStyle = {
      transform: 'scale(0.8)'
    }

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = 'grayscale(100%)'
      markerIconStyle.opacity = '0.8'
    }

    return (
      <div>
        {isCompassBearingEnabled && compassBearing ?
          <img
            style={{width: 20, height: 20, marginLeft: 32, marginTop: -20, transform: `rotate(${compassBearing}deg)`}}
            src={compassBearingIcon}
          />
          : null
        }
        <img src={markerIcon} style={markerIconStyle} className={ shouldBeFocused ? 'focused' : ''} />
        <div style={quayStyle}>
          <div style={{color: '#fff', display: 'flex', marginLeft: -2*(quayShortName.length), fontSize: String(quayShortName.length).length > 1 ? '1em' : '1.2em'}}>
            <div style={{paddingLeft: shouldBeFocused ? 2 : 0 }}>Q</div>
            <div style={{color: '#fff', display: 'inline-block', fontSize: '0.6em', textTransform: 'capitalize'}}>{quayShortName}</div>
          </div>
        </div>
      </div>
    )
  }
}

const getShortQuayName = (quayName) => {
  if (!isNaN(quayName)) return quayName
  return (quayName.length > 1)  ? quayName.substring(0,1): quayName
}

const mapStateToProps = (state, ownProps) => {

  return {
    polylineStartPoint: state.editStopReducer.polylineStartPoint,
    isCreatingPolylines: state.editStopReducer.isCreatingPolylines,
    isCompassBearingEnabled: state.editStopReducer.isCompassBearingEnabled,
    focusedElement: state.editStopReducer.focusedElement,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuayMarker)

