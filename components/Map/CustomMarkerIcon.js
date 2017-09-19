/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

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
    const { stopType, active, hasExpired, submode, isMultimodal, isMultimodalChild } = this.props;

    let imageStyle = {
      padding: 3,
      background: '#0060b9',
      borderRadius: '50%',
    };

    if (!active) {
      imageStyle.opacity = hasExpired ? '0.5' : '1.0';
      imageStyle.filter = isMultimodalChild ? 'grayscale(60%)' : 'grayscale(80%)';
    }

    const icon = getIconIdByTypeOrSubmode(submode, stopType, isMultimodal);

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

const getIconIdByTypeOrSubmode = (submode, type, isMultimodal) => {
  const submodeMap = {
    railReplacementBus: require('../../static/icons/modalities/' + 'railReplacement' + '.png')
  };
  return submodeMap[submode] || getIconIdByModality(type, isMultimodal);

}
const getIconIdByModality = (type, isMultimodal) => {

  if (isMultimodal) {
    return require('../../static/icons/modalities/multiModal.png');
  }

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
