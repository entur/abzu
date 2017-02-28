const markerIcon = require('../static/icons/quay-marker-background.png')
import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import { connect } from 'react-redux'
import compassIcon from '../static/icons/compass.png'
import compassBearingIcon from '../static/icons/compass-bearing.png'

class QuayMarker extends React.PureComponent {

  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.string,
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
    const { isCreatingPolylines, id, pathLink } = this.props

    let isIncomplete = false

    if (!position) return null

    let pathLinkText = isCreatingPolylines ? translations.terminatePathLinkHere : translations.createPathLinkHere

    if (isCreatingPolylines && pathLink && pathLink.length) {

      let lastPathLink = pathLink[pathLink.length-1]

      if (lastPathLink.from && lastPathLink.from.quay && lastPathLink.from.quay.id === id) {
        pathLinkText = translations.cancelPathLink
      } else {
        // LineString should either have 0 or >= 2 [long,lat] according to GeoJSON spec
        if (lastPathLink.inBetween && lastPathLink.inBetween.length == 1) {
          isIncomplete = true
        }
      }
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
          onDragend={(event) => { handleQuayDragEnd(index, 'quay', event) }}
        >
          <Popup autoPan={false}>
            <div>
               <span className="quay-marker-title">
                 { parentStopPlaceName }
                </span>
                <span className="quay-marker-title" style={{marginTop: -2, marginBottom: 5, fontSize: '1em', color: '#191919'}}>{formattedStopType + " " + (name || translations.untitled)}</span>
               { id ?  <div
                   className={`change-path-link ${isIncomplete ? 'incomplete' : ''}`}
                   onClick={() => { handleUpdatePathLink(position, id, 'quay') }}
                 >
                   { pathLinkText }
                   { isIncomplete ? <div style={{color: '#000', fontWeight: 600}}> { translations.inComplete } </div> : null }
                 </div>
                 : <div style={{textAlign: 'center', marginBottom: 10, padding: 10, border: '1px solid #9E9E9E'}}>
                   { translations.saveFirstPathLink }
                   </div>
               }
                <div
                  style={{display: 'block', cursor: 'pointer', width: 'auto', textAlign: 'center'}}
                  onClick={() => !belongsToNeighbourStop && handleChangeCoordinates(true, id, position)}
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
                :  <div onClick={() => { this.props.handleSetCompassBearing(this.props.compassBearing, index) }} style={{textAlign: 'center', marginTop: 10}}>
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

  componentWillMount() {
    const { focusedElement, index, belongsToNeighbourStop, compassBearing } = this.props

    let markerIconStyle = { transform: 'scale(0.8)' }

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = 'grayscale(100%)'
      markerIconStyle.opacity = '0.8'
    }

    this._shouldBeFocused = (focusedElement.type === 'quay' && index === focusedElement.index)
    this._markerIcon = <img src={markerIcon} style={markerIconStyle} className={ this._shouldBeFocused ? 'focused' : ''} />
    this._compassBearingIcon = (
      <img
        style={{width: 20, height: 20, marginLeft: 32, marginTop: -20, transform: `rotate(${compassBearing}deg)`}}
        src={compassBearingIcon}
      />
    )
  }

  render() {

    const { name, compassBearing, isCompassBearingEnabled } = this.props
    const quayShortName = getShortQuayName(name)

    const quayStyle = {
      color: '#fff',
      position: 'absolute',
      top: 10,
      left: 36,
      fontSize: '0.8em',
      zIndex: 9999,
    }

    return (
      <div>
        {isCompassBearingEnabled && compassBearing ?
          this._compassBearingIcon
          : null
        }
        { this._markerIcon }
        <div style={quayStyle}>
          <div style={{color: '#fff', display: 'flex', marginLeft: -2*(quayShortName.length), fontSize: String(quayShortName.length).length > 1 ? '1em' : '1.2em'}}>
            <div>Q</div>
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

const mapStateToProps = state => {
  return {
    isCreatingPolylines: state.editingStop.isCreatingPolylines,
    isCompassBearingEnabled: state.editingStop.isCompassBearingEnabled,
    focusedElement: state.editingStop.focusedElement,
    pathLink: state.stopPlace.pathLink
  }
}

export default connect(mapStateToProps)(QuayMarker)

