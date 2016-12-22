import React from 'react'
const stopIcon = require("../static/icons/stop-icon-2x.svg")

class CustomMarkerIcon extends React.Component {

  render() {

    const { markerIndex, isQuay, stopType, active, compassBearing, quayName, shouldBeFocused, isCompassBearingEnabled } = this.props
    const iconId = getIconIdByModality(stopType)
    let fillClass = (active && isQuay) ? "quay" : active ? "" : "neighbour-stop"
    fillClass += shouldBeFocused ? ' focused' : ''
    const quayShortName = getShortQuayName(quayName)

    return (
      <div id={'stop-marker-' + markerIndex }>
        { (isCompassBearingEnabled && isQuay && typeof compassBearing !== 'undefined') ?
          <svg id={'cp-' +markerIndex} style={{width: 20, height: 20, marginLeft: -4, marginTop: -52, transform: `rotate(${compassBearing}deg)`}}>
            <use xlinkHref={config.endpointBase + 'static/icons/svg-sprite.svg#icon-icon_arrow-forward'} />
          </svg> : null }
        <svg className={'stop-marker-parent ' + fillClass}>
          <use xlinkHref={stopIcon + '#marker'}/>
        </svg>
        {isQuay
          ? <div className="q-marker" style={{left: quayShortName.length ? (quayShortName.length * -1):2}}>
          <div
            style={{color: '#fff', marginRight: 1, fontSize: String(markerIndex+1).length > 1 ? '1em' : '1.2em'}}
          >
            Q<sub style={{color: '#fff'}}>{quayShortName}</sub>
          </div>
        </div>
          :
          <svg styke={{fill: '#fff'}} className='stop-marker-svg'>
            <use xlinkHref={config.endpointBase + 'static/icons/svg-sprite.svg#icon-icon_' + iconId} />
        </svg>
        }
      </div>
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
  return modalityMap[type] || 'no-information'
}

export const getShortQuayName = (quayName) => {
  if (typeof quayName == 'undefined' || !quayName.length) {
    return ''
  }

  if (!isNaN(quayName)) return quayName

  if (quayName.length > 1) return quayName.substring(0,1)

  return quayName
}

export default CustomMarkerIcon