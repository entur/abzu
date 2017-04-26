import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'


class ModalityIcon extends React.Component {

  componentWillMount() {
    this.loadIcons(this.props)
  }

  loadIcons(nextProps) {
    let svgStyle = nextProps.svgStyle || {
        width: 30,
        height: 25,
        display: 'inline-block',
        marginRight: 5,
      }

    const iconStyle = nextProps.iconStyle || {
        float: 'left',
        transform: 'translateY(2px)',
      }

    const iconId = getIconIdByModality(nextProps.type)

    let style = {
      ...nextProps.style || {},
    }

    this._icon = (
      <span style={iconStyle}>
        <SvgIcon style={{ ...style, ...svgStyle}}>
            <use xlinkHref={`${config.endpointBase}static/icons/svg-sprite.svg#icon-icon_${iconId}`}></use>
        </SvgIcon>
      </span>)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isStatic) {
      this.loadIcons(nextProps)
    }
  }

  render() {
    return this._icon
  }
}

const getIconIdByModality = (type) => {
  const modalityMap = {
    'onstreetBus': 'bus-withoutBox',
    'onstreetTram' : 'tram-withoutBox',
    'railStation' : 'rail-withoutBox',
    'metroStation' : 'subway-withoutBox',
    'busStation': 'busstation-withoutBox',
    'ferryStop' : 'ferry-withoutBox',
    'airport' : 'airplane-withoutBox',
    'harbourPort' : 'harbour_port',
    'liftStation' : 'lift',
    'other' : 'no-information'
  }
  return modalityMap[type] || 'no-information'
}

export default ModalityIcon
