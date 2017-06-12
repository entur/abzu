import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
const newStopIcon = require('../static/icons/new-stop-icon-2x.png');
const markerShadow = require('../static/icons/marker-shadow.png');

class NewStopMarker extends React.PureComponent {
  static PropTypes = {
    text: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  };

  render() {
    let { children, position, handleOnClick, handleDragEnd, text } = this.props;

    const buttonStyle = {
      borderStyle: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline',
      background: '#fff',
      padding: '1px',
      width: '100%',
      verticalAlign: 'middle',
    };

    var icon = L.icon({
      iconUrl: newStopIcon,
      shadowUrl: markerShadow,
      iconSize: [30, 45],
      iconAnchor: [17, 42],
      popupAnchor: [0, 0],
      shadowAnchor: [12, 12],
      shadowSize: [36, 16],
    });

    return (
      <Marker
        ref="newstopMarker"
        key="newstop-key"
        onDragend={e => {
          handleDragEnd(e);
        }}
        draggable={true}
        position={position}
        icon={icon}
      >
        <Popup>
          <div>
            <span onClick={handleOnClick}>{children}</span>
            <div>
              <p style={{ fontWeight: '600' }}>{text.newStopTitle}</p>
              <p>{text.newStopQuestion}</p>
              <button
                style={buttonStyle}
                onClick={() => {
                  handleOnClick(position);
                }}
              >
                {text.createNow}
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default NewStopMarker;
