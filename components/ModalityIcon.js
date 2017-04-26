import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'


class ModalityIcon extends React.Component {

  componentWillUpdate(nextProps) {
    return (this.props.type == nextProps.type)
  }

  render() {

    let svgStyle = this.props.svgStyle || {
        width: 30,
        height: 25,
        display: 'inline-block',
        marginRight: 5,
      }

    const iconStyle = this.props.iconStyle || {
        float: 'left',
        transform: 'translateY(2px)',
      }

    const iconId = getIconIdByModality(this.props.type)

    let style = {
      ...this.props.style || {},
    }

    return (

      <span style={iconStyle}>
        <SvgIcon style={{ ...style, ...svgStyle}}>
            <use xlinkHref={`${config.endpointBase}static/icons/svg-sprite.svg#icon-icon_${iconId}`}></use>
        </SvgIcon>
      </span>)
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
