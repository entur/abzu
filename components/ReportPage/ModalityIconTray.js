import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalityIcon from '../MainPage/ModalityIcon';
import { getUniqueStopPlaceTypes } from '../../models/StopPlaceUtils';

class ModalityIconTray extends Component {
  render() {
    const { modalities, style } = this.props;

    if (!modalities) return null;

    const uniqueModalities = getUniqueStopPlaceTypes(modalities);

    return (
      <div style={style || { display: 'flex', alignItems: 'center' }}>
        {uniqueModalities.map((modality, i) =>
          <ModalityIcon
            key={'modality-' + i}
            iconStyle={{transform: 'scale(0.8)'}}
            submode={modality.submode}
            type={modality.stopPlaceType}
          />
        )}
      </div>
    );
  }
}

ModalityIconTray.propTypes = {
  modalities: PropTypes.shape({
    submode: PropTypes.string,
    stopPlaceType: PropTypes.string
  }),
  style: PropTypes.object
};

export default ModalityIconTray;
