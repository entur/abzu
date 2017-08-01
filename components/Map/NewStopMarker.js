import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
const newStopIcon = require('../static/icons/new-stop-icon-2x.png');
const markerShadow = require('../static/icons/marker-shadow.png');
import PManager from '../singletons/PolygonManager';

class NewStopMarker extends React.PureComponent {
  static PropTypes = {
    text: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  };

  render() {

    let { children, position, handleOnClick, handleDragEnd, text } = this.props;

    var icon = L.icon({
      iconUrl: newStopIcon,
      shadowUrl: markerShadow,
      iconSize: [30, 45],
      iconAnchor: [17, 42],
      popupAnchor: [0, 0],
      shadowAnchor: [12, 12],
      shadowSize: [36, 16],
    });

    let latlngInside = new PManager().isPointInPolygon(position);

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
            { latlngInside ?
              <div>
                <p style={{ fontWeight: '600' }}>{text.newStopTitle}</p>
                <p>{text.newStopQuestion}</p>
                <div
                  className="marker-popup-button"
                  onClick={() => {
                    handleOnClick(position);
                  }}
                >
                  {text.createNow}
                </div>
              </div>
              : <div>
                <p style={{fontWeight: 600}}>{text.newStopTitle}</p>
                <div
                  className="marker-popup-not-legal"
                >
                  {text.createNotAllowed}
                </div>
              </div>
            }
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default NewStopMarker;
