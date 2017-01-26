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
    const icon = getIconIdByModality(stopType)
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
          <img className='stop-marker-svg' src={icon}/>
        </div>
      </div>
    )
  }
}

const getIconIdByModality = (type) => {
  const modalityMap = {
    'onstreetBus': 'bus-without-box',
    'onstreetTram' : 'tram-without-box',
    'railStation' : 'rails-without-box',
    'metroStation' : 'metro-without-box',
    'busStation': 'bus-without-box',
    'ferryStop' : 'ferry-without-box',
    'airport' : 'airport-without-box',
    'harbourPort' : 'ferry-without-box',
    'liftStation': 'lift-without-box'
  }

  const stopType = modalityMap[type] || 'no-information'

  return require('../static/icons/modalities/' + stopType + '.png')
}

export default CustomMarkerIcon