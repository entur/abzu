import React, { Component, PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import stopIcon from "../static/icons/stop-icon-2x.svg"
import ReactDOM from 'react-dom/server'

class CustomPopupMarker extends React.Component {

  /* avoid rerendering markers if significant information to
     the marker in question has been changed */
  shouldComponentUpdate(nextProps, nextState) {

    if (this.props.active !== nextProps.active) {
      return true
    }

    if (JSON.stringify(this.props.position) !== JSON.stringify(nextProps.position)) {
      return true
    }

    if (!nextProps.isQuay && ((this.props.stopType !== nextProps.stopType) || (this.props.children !== nextProps.children) ||
        (this.props.formattedStopType !== nextProps.formattedStopType))) {
      return true
    }

    if (this.props.isCreatingPoylines !== nextProps.isCreatingPoylines && nextProps.isQuay) {
      return true
    }

    return false
  }

  render() {

    let { children, position, handleOnClick,
          handleDragEnd, isQuay, markerIndex, draggable,
          changeCoordinates, text, active, stopType, formattedStopType, handleCreatePathLink, isCreatingPoylines  } = this.props

    if (!children && !children.length) {
      children = text.untitled
    }

    let divIconBody = (
      <SuperIcon
        markerIndex={markerIndex}
        isQuay={isQuay}
        stopType={stopType}
        active={active}
        />
    )

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(divIconBody)

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
              >{formattedStopType + " " + (markerIndex+1)}</span>
            : null
            }
            { !isQuay
              ? null
              : <div
                  style={{fontWeight: 600, marginBottom: 10, cursor: 'pointer', color: 'blue', width: '100%', display: 'inline-block', textAlign: 'center'}}
                  onClick={() => { handleCreatePathLink(position, markerIndex) }}
                >{ isCreatingPoylines ? 'Avslutt ganglenke her' : 'Opprett ganglenke' } </div>
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
          </div>
        </Popup>
      </Marker>
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

    return (
      <div id={'stop-marker-' + markerIndex }>
        <svg className={'stop-marker-parent ' + fillClass}>
          <use xlinkHref={stopIcon + '#marker'}/>
        </svg>
        {isQuay
          ? <div className="q-marker">
              <div
                  style={{color: '#fff', marginRight: 1, fontSize: String(markerIndex+1).length > 1 ? '1em' : '1.2em'}}
                >
                Q<sub style={{color: '#fff'}}>{markerIndex+1}</sub>
              </div>
        </div>
          : <svg className='stop-marker-svg'>
              <use xlinkHref={config.endpointBase + 'static/icons/svg-sprite.svg#icon-icon_' + iconId} />
            </svg>
         }
      </div>
    )
  }

}

export default CustomPopupMarker
