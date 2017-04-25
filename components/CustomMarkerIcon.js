import React, { PropTypes } from 'react'

class CustomMarkerIcon extends React.Component {

  static propTypes = {
    markerIndex: PropTypes.number.isRequired,
    stopType: PropTypes.string,
    active: PropTypes.bool.isRequired
  }

  componentWillMount() {

    const { stopType, active } = this.props

    let imageStyle = {
      padding: 3,
      background: '#0060b9',
      borderRadius: '50%'
    }

    if (!active) {
      imageStyle.opacity = '0.8'
      imageStyle.filter = 'grayscale(80%)'
    }

    const icon = getIconIdByModality(stopType)

    this._stopTypeIcon = <img style={{width: 20, height: 20, ...imageStyle}} src={icon} />
  }

  render() {

    return (
      <div>
          { this._stopTypeIcon }
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