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


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalityIconImg from '../MainPage/ModalityIconImg';
import { getUniqueStopPlaceTypes } from '../../models/stopPlaceUtils';

class ModalityIconTray extends Component {
  render() {
    const { modalities, style } = this.props;

    if (!modalities) return null;

    const uniqueModalities = getUniqueStopPlaceTypes(modalities);

    return (
      <div style={style || { display: 'flex', alignItems: 'center' }}>
        {uniqueModalities.map((modality, i) =>
          <ModalityIconImg
            key={'modality-' + i}
            submode={modality.submode}
            iconStyle={{
              float: 'right',
              transform: 'translateY(2px) scale(0.8)'
            }}
            type={modality.stopPlaceType}
          />
        )}
      </div>
    );
  }
}

ModalityIconTray.propTypes = {
  modalities: PropTypes.arrayOf(PropTypes.shape({
    submode: PropTypes.string,
    stopPlaceType: PropTypes.string
  })),
  style: PropTypes.object
};

export default ModalityIconTray;
