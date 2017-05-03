const markerIcon = require('../static/icons/quay-marker-background.png')
import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import { connect } from 'react-redux'
import compassIcon from '../static/icons/compass.png'
import compassBearingIcon from '../static/icons/compass-bearing.png'
import OSMIcon from '../static/icons/osm_logo.png'
import { getIn } from '../utils/'

class QuayMarker extends React.PureComponent {

  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.string,
    parentId: PropTypes.number.isRequired,
    parentStopPlaceName: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(Number),
    name: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    handleQuayDragEnd: PropTypes.func.isRequired,
    formattedStopType: PropTypes.string.isRequired,
    handleUpdatePathLink: PropTypes.func.isRequired,
    isCreatingPolylines: PropTypes.bool.isRequired,
    handleChangeCoordinates: PropTypes.func,
    draggable: PropTypes.bool.isRequired,
    handleSetCompassBearing: PropTypes.func
  }

  getOSMURL() {
    const { position } = this.props
    return `https://www.openstreetmap.org/edit#map=18/${position[0]}/${position[1]}`
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.position !== nextProps.position) {
      return true
    }

    if (this.props.name !== nextProps.name) {
      return true
    }

    if (this.props.index !== nextProps.index) {
      return true
    }

    if (this.props.focusedElement !== nextProps.focusedElement) {
      return true
    }

    if (this.props.belongsToNeighbourStop !== nextProps.belongsToNeighbourStop) {
      return true
    }

    if (this.props.compassBearing !== nextProps.compassBearing) {
      return true
    }

    if (this.props.isCompassBearingEnabled !== nextProps.isCompassBearingEnabled) {
      return true
    }

    if (this.props.formattedStopType !== nextProps.formattedStopType) {
      return true
    }

    if (this.props.isCreatingPolylines !== nextProps.isCreatingPolylines) {
      return true
    }

    if (this.props.id !== nextProps.id) {
      return true
    }

    if (this.props.pathLink !== nextProps.pathLink) {
      return true
    }

    return false
  }

  render() {

    const { position, name, index, handleQuayDragEnd, parentStopPlaceName, formattedStopType, handleUpdatePathLink, translations, handleChangeCoordinates, belongsToNeighbourStop, isEditingStop } = this.props
    const { isCreatingPolylines, id, pathLink, showPathLink } = this.props

    if (!position) return null

    let isIncomplete = false

    let pathLinkText = isCreatingPolylines ? translations.terminatePathLinkHere : translations.createPathLinkHere

    if (isCreatingPolylines && pathLink && pathLink.length) {

      let lastPathLink = pathLink[pathLink.length-1]
      let fromId = getIn(lastPathLink, ['from', 'placeRef', 'addressablePlace', 'id'], null)

      if (fromId === id) {
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
        isEditingStop={isEditingStop}
        index={index}
        name={name}
        focusedElement={this.props.focusedElement}
        compassBearing={this.props.compassBearing}
        isCompassBearingEnabled={this.props.isCompassBearingEnabled}
        belongsToNeighbourStop={belongsToNeighbourStop}
      />
    )

    let quayIcon = divIcon({
        html: divBody,
        iconSize: [21,45],
        iconAnchor: [42, 45],
        popupAnchor: [0, 0]
      }
    )

    const osmURL = this.getOSMURL()

    return (
        <Marker
          position={position}
          icon={quayIcon}
          draggable={this.props.draggable}
          onDragend={(event) => { handleQuayDragEnd(index, 'quay', event) }}
          keyboard={false}
        >
          <Popup autoPan={false}>
            <div>
               <span className="quay-marker-title">
                 { parentStopPlaceName }
                </span>
                <span className="quay-marker-title" style={{marginTop: -2, marginBottom: 5, fontSize: '1em', color: '#191919'}}>
                  {formattedStopType + " " + (name || translations.untitled)}
                  </span>
                <div
                  style={{display: 'block', cursor: 'pointer', width: 'auto', textAlign: 'center', fontSize: 10}}
                  onClick={() => !belongsToNeighbourStop && handleChangeCoordinates(true, id, position)}
                >
                  <span style={{display: 'inline-block', textAlign: 'center', borderBottom: !belongsToNeighbourStop ? '1px dotted black' : 'none', }}>
                      {position[0]}
                  </span>
                  <span style={{display: 'inline-block', marginLeft: 3, borderBottom: !belongsToNeighbourStop ? '1px dotted black' : 'none'}}>
                    {position[1]}
                  </span>
                </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
              { (belongsToNeighbourStop || !this.props.draggable)
                ? null
                :  <div onClick={() => { this.props.handleSetCompassBearing(this.props.compassBearing, index) }}>
                    <img style={{width: 20, height: 22, cursor: 'pointer'}} src={compassIcon}/>
                  </div>
              }
              <div style={{marginLeft: belongsToNeighbourStop ? 0: 10, cursor: 'pointer'}}>
                <a href={osmURL} target="_blank">
                  <img style={{width: 20, height: 22, border: '1px solid grey', borderRadius: 50}} src={OSMIcon}/>
                </a>
              </div>
              </div>
              <div style={{marginTop: 10}}>
                { (showPathLink && isEditingStop)?
                    <div>
                      { id ?  <div
                          className={`change-path-link ${isIncomplete ? 'incomplete' : ''}`}
                          onClick={() => { handleUpdatePathLink(position, id, 'quay') }}
                        >
                          { pathLinkText }
                          { isIncomplete ? <div style={{color: '#000', fontWeight: 600}}> { translations.inComplete } </div> : null }
                        </div>
                        : <div style={{textAlign: 'center', padding: 10, border: '1px solid #9E9E9E'}}>
                          { translations.saveFirstPathLink }
                        </div>
                      }
                    </div>
                    : null
                }
              </div>
            </div>
          </Popup>
        </Marker>
      )
  }
}

class QuayMarkerIcon extends React.PureComponent {

  componentWillMount() {
    const { focusedElement, index, belongsToNeighbourStop, compassBearing } = this.props

    let markerIconStyle = { transform: 'scale(0.7)', marginLeft: 24  }

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = 'grayscale(100%)'
      markerIconStyle.opacity = '0.8'
    }

    this._shouldBeFocused = (focusedElement.type === 'quay' && index === focusedElement.index)
    this._markerIcon = <img src={markerIcon} style={markerIconStyle} className={ this._shouldBeFocused ? 'focused' : ''} />
    this._compassBearingIcon = (
      <img
        style={{width: 20, height: 20, marginLeft: 32, marginTop: -20, transform: `rotate(${compassBearing}deg) scale(0.7)`}}
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
        { isCompassBearingEnabled && compassBearing ?
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

const mapStateToProps = state => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  focusedElement: state.mapUtils.focusedElement,
  pathLink: state.stopPlace.pathLink
})

export default connect(mapStateToProps)(QuayMarker)

