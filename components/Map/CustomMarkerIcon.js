import React from 'react';
import PropTypes from 'prop-types';

class CustomMarkerIcon extends React.Component {
  static propTypes = {
    markerIndex: PropTypes.number.isRequired,
    stopType: PropTypes.string,
    active: PropTypes.bool.isRequired,
    hasExpired: PropTypes.bool,
  };

  componentWillMount() {
    const { stopType, active, hasExpired, submode } = this.props;

    let imageStyle = {
      padding: 3,
      background: '#0060b9',
      borderRadius: '50%',
    };

    if (!active) {
      imageStyle.opacity = hasExpired ? '0.5' : '1.0';
      imageStyle.filter = 'grayscale(80%)';
    }

    const icon = getIconIdByTypeOrSubmode(submode, stopType);

    this._stopTypeIcon = (
      <img style={{ width: 20, height: 20, ...imageStyle }} src={icon} />
    );
  }

  render() {
    return (
      <div>
        {this._stopTypeIcon}
      </div>
    );
  }
}

const getIconIdByTypeOrSubmode = (submode, type) => {
  const submodeMap = {
    railReplacementBus: require('../../static/icons/modalities/' + 'railReplacement' + '.png')
  };
  return submodeMap[submode] || getIconIdByModality(type);

}
const getIconIdByModality = type => {
  const modalityMap = {
    onstreetBus: 'bus-without-box',
    onstreetTram: 'tram-without-box',
    railStation: 'rails-without-box',
    metroStation: 'metro-without-box',
    busStation: 'busstation-without-box',
    ferryStop: 'ferry-without-box',
    airport: 'airport-without-box',
    harbourPort: 'harbour_port',
    liftStation: 'lift-without-box',
  };

  const stopType = modalityMap[type] || 'no-information';

  return require('../../static/icons/modalities/' + stopType + '.png');
};

export default CustomMarkerIcon;
