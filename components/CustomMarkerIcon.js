import React, { PropTypes } from 'react'
const StopMarkerIcon = require('../static/icons/stop-marker-background.png')

class CustomMarkerIcon extends React.Component {

  static propTypes = {
    markerIndex: PropTypes.number.isRequired,
    stopType: PropTypes.string,
    active: PropTypes.bool.isRequired
  }

  componentWillMount() {

    const { stopType, active } = this.props

    let imageStyle = { transform: 'scale(0.35)' }

    if (!active) {
      imageStyle.opacity = '0.8'
      imageStyle.filter = 'grayscale(80%)'
    }

    const icon = getIconIdByModality(stopType)

    this._stopMarkerIcon = <img src={StopMarkerIcon} style={imageStyle} />
    this._stopTypeIcon = <img className='stop-marker-svg' src={icon}/>
  }

  render() {

    const { markerIndex } = this.props

    return (
      <div key={'stop-marker-' + markerIndex}>
        { this._stopMarkerIcon }
        <div>
          { this._stopTypeIcon }
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
    'busStation': 'busstation-without-box',
    'ferryStop' : 'ferry-without-box',
    'airport' : 'airport-without-box',
    'harbourPort' : 'ferry-without-box',
    'liftStation': 'lift-without-box'
  }

  const stopType = modalityMap[type] || 'no-information'

  return require('../static/icons/modalities/' + stopType + '.png')
}

export default CustomMarkerIcon