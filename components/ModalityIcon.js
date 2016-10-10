import React from 'react'

const ModalityIcon = (props) =>  {

  const iconStyle = {
    width: 25,
    height: 25,
    display: 'inline-block',
    marginRight: 5
  }

  const iconId = getIconIdByModality(props.type)

  return (
    <span style={{float: 'left', transform: 'translateY(8px)'}}>
      <svg style={iconStyle}>
        <use xlinkHref={config.endpointBase + 'static/icons/svg-sprite.svg' + "#icon-icon_" + iconId} />
      </svg>
    </span>
  )
}

const getIconIdByModality = (type) => {

  // TODO: not supported:
  // harbourPort, liftStation

  const modalityMap = {
    'onstreetBus': 'bus-withoutBox',
    'onstreetTram' : 'tram-withoutBox',
    'railStation' : 'rail-withoutBox',
    'metroStation' : 'subway-withoutBox',
    'busStation': 'bus-withoutBox',
    'ferryStop' : 'ferry-withoutBox',
    'airport' : 'airplane-withoutBox',
    'other' : 'no-information'
  }
  var iconId = modalityMap[type]

  return iconId || 'no-information'
}

export default ModalityIcon
