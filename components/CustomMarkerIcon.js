import React, { PropTypes } from 'react'
const StopMarkerIcon = require('../static/icons/stop-marker-background.png')

class CustomMarkerIcon extends React.Component {

  static propTypes = {
    markerIndex: PropTypes.number.isRequired,
    stopType: PropTypes.string,
    active: PropTypes.bool.isRequired
  }

  render() {

    const { markerIndex, stopType, active } = this.props
    const iconId = getIconIdByModality(stopType)
    let imageStyle = {
      transform: 'scale(0.35)'
    }

    if (!active) {
      imageStyle.opacity = '0.8'
      imageStyle.filter = 'grayscale(80%)'
    }

    return (
      <div key={'stop-marker-' + markerIndex}>
        <img src={StopMarkerIcon} style={imageStyle} />
        <div>
          <svg className='stop-marker-svg'>
            <use xlinkHref={config.endpointBase + 'static/icons/svg-sprite.svg#icon-icon_' + iconId} />
          </svg>
        </div>
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