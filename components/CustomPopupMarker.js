import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import markerShadow from "../static/icons/marker-shadow.png"
import stopIcon from "../static/icons/stop-icon-2x.svg"
import ModalityIcon from './ModalityIcon'
import DivIcon from 'react-leaflet-div-icon'

class CustomPopupMarker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false
    }
  }

  handleTogglePopup() {
    this.setState({
      popupVisible: !this.state.popupVisible
    })
  }

  render() {

    let { children, position, handleOnClick,
          handleDragEnd, isQuay, markerIndex, draggable,
          changeCoordinates, text, active, stopType  } = this.props

    let { popupVisible } = this.state

    if (!children && !children.length) {
      children = text.untitled
    }

    const editCoordsStyle = {
      display: 'block',
      borderBottom: '1px dotted black',
      cursor: 'pointer'
    }

    const style = !isQuay ? {
      color: '#0086b3',
      cursor: "pointer",
    } : { color: '#00cc00' }

    const coordStyles = {
      display: 'block',
      marginTop: 5
    }

    const popupWrapping = {
      width: 300
    }

    const closeButton = {
      fontWeight: 'bold',
      fontStretch: 'normal',
      fontSize: 16,
      lineJeight: 14,
      float: 'right',
      color: 'rgb(195, 195, 195)',
      margin: 10,
      background: 'transparent'
    }

    return (

      <DivIcon
        position={position}
        className='markerBus'
        key={"key" + markerIndex}
        onDragend={(event) => { handleDragEnd(isQuay, markerIndex, event) }}
        draggable={draggable && active}
        >
        <div>
          <div
            onClick={this.handleTogglePopup.bind(this)}
            >
            <SuperIcon
              markerIndex={markerIndex}
              isQuay={isQuay}
              stopType={stopType}
              active={active}
              onClick={this.handleTogglePopup.bind(this)}
              />
          </div>
          { popupVisible
            ?
             (<div style={popupWrapping} className='leaflet-popup-content-wrapper'>
               <div onClick={this.handleTogglePopup.bind(this)} style={closeButton}>x</div>
               <div className='leaflet-popup-content'>
                 <span style={style} onClick={handleOnClick}>{children}</span>
                 <div style={coordStyles}>
                   <span style={{fontWeight: 600}}>{text.coordinates}</span>
                     <div
                       style={editCoordsStyle}
                       onClick={() => changeCoordinates && changeCoordinates(isQuay, markerIndex, position)}
                       >
                       <span>{position[0]},</span>
                       <span style={{marginLeft: 2}}>{position[1]}</span>
                     </div>
                 </div>
               </div>
              </div>)
            : null
          }
          </div>
       </DivIcon>
    )
  }
}



const getIconIdByModality = (type) => {

  const modalityMap = {
    'onstreetBus': 'bus-withoutBox',
    'onstreetTram' : 'tram-withoutBox',
    'railStation' : 'rail-withoutBox',
    'metroStation' : 'subway-withoutBox',
    'busStation': 'bus-withoutBox',
    'ferryStop' : 'ferry-withoutBox',
    'airport' : 'airplane-withoutBox',
    'harbourPort' : 'ferry-withoutBox',
    'liftStation': 'lift'
  }
  var iconId = modalityMap[type]

  return iconId || 'no-information'
}


class SuperIcon extends React.Component {

  render() {

    const { markerIndex, isQuay, stopType, active } = this.props
    const iconId = getIconIdByModality(stopType)
    const fillClass = (active && isQuay) ? "quay" : active ? "" : "neighbour-stop"

    const iconSize = isQuay ? [22, 33] : [30, 45]
    const iconAnchor = isQuay ? [11, 28] : [17, 42]
    const shadowAnchor = isQuay ? [11, 8] : [10, 12]

    return (
      <div id={'stop-marker-' + markerIndex }>
        <svg className={'stop-marker-parent ' + fillClass}>
          <use xlinkHref={stopIcon + '#marker'}/>
        </svg>
        {isQuay
          ? <div className="q-marker">Q</div>
          : <svg className='stop-marker-svg'>
              <use xlinkHref={ config.endpointBase + 'static/icons/svg-sprite.svg#icon-icon_' + iconId} />
            </svg>
         }
        <img className='stop-marker-shadow' src={markerShadow}/>
      </div>
    )
  }

}

export default CustomPopupMarker
