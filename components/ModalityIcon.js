import React from 'react'

class ModalityIcon extends React.PureComponent {

  render() {

    const svgStyle = this.props.svgStyle || {
      width: 25,
      height: 25,
      display: 'inline-block',
      marginRight: 5
    }

    const iconStyle = this.props.iconStyle || {
      float: 'left',
      transform: 'translateY(2px)'
    }

    const iconId = getIconIdByModality(this.props.type)

    return (
      <span style={iconStyle}>
        <svg style={svgStyle}>
            <use xlinkHref={`${config.endpointBase}static/icons/svg-sprite.svg#icon-icon_${iconId}`}></use>
        </svg>
      </span>
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
    'liftStation' : 'lift',
    'other' : 'no-information'
  }
  return modalityMap[type] || 'no-information'
}

export default ModalityIcon
