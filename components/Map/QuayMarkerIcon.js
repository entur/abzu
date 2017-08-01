import React from 'react';
import compassBearingIcon from '../../static/icons/compass-bearing.png';
const markerIcon = require('../../static/icons/quay-marker-background.png');

class QuayMarkerIcon extends React.Component {

  componentWillMount() {
    const {
      focusedElement,
      index,
      belongsToNeighbourStop,
      compassBearing
    } = this.props;

    let markerIconStyle = { transform: 'scale(0.7)' };

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = 'grayscale(100%)';
      markerIconStyle.opacity = '0.8';
    }

    this._shouldBeFocused =
      focusedElement.type === 'quay' && index === focusedElement.index;
    this._markerIcon = (
      <img
        src={markerIcon}
        style={markerIconStyle}
        className={this._shouldBeFocused ? 'focused' : ''}
      />
    );
    this._compassBearingIcon = (
      <img
        style={{
          width: 20,
          height: 20,
          marginLeft: 6,
          position: 'absolute',
          marginTop: -12,
          transform: `rotate(${compassBearing}deg) scale(0.7)`
        }}
        src={compassBearingIcon}
      />
    );
  }

  render() {
    const { publicCode, compassBearing, isCompassBearingEnabled } = this.props;
    const quayShortName = getShortQuayName(publicCode);

    const quayStyle = {
      color: '#fff',
      position: 'absolute',
      top: 12,
      left: 1,
      zIndex: 9999
    };

    return (
      <div>
        {isCompassBearingEnabled && compassBearing
          ? this._compassBearingIcon
          : null}
        {this._markerIcon}
        <div style={quayStyle}>
          <div
            style={{
              width: 30,
              fontSize: quayShortName ? 12 : 10,
              textAlign: 'center'
            }}
          >
            {quayShortName || 'N/A'}
          </div>
        </div>
      </div>
    );
  }
}

export default QuayMarkerIcon;

const getShortQuayName = quayName => {
  if (!isNaN(quayName)) return quayName;
  return quayName.length > 1 ? quayName.substring(0, 1) : quayName;
};
