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
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import PManager from '../../singletons/PolygonManager';

const newStopIcon = require('../../static/icons/new-stop-icon-2x.png');
const markerShadow = require('../../static/icons/marker-shadow.png');

class NewStopMarker extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  };

  render() {

    let { children, position, handleOnClick, handleDragEnd, text, newStopIsMultiModal } = this.props;

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
                <p style={{ fontWeight: '600' }}>
                  {newStopIsMultiModal ? text.newParentStopTitle : text.newStopTitle}
                </p>
                <p> {newStopIsMultiModal ? text.newParentStopQuestion : text.newStopQuestion}</p>
                <div style={{textAlign: 'center'}}>
                  <div
                    className="marker-popup-button"
                    style={{maxWidth: 180}}
                    onClick={() => {
                      handleOnClick(position);
                    }}
                  >
                    {text.createNow}
                  </div>
                </div>
              </div>
              : <div>
                <p style={{fontWeight: 600, textAlign: 'center'}}>
                  {newStopIsMultiModal ? text.newParentStopTitle : text.newStopTitle}
                  </p>
                <div style={{textAlign: 'center'}}>
                  <div className="marker-popup-not-legal">
                    {text.createNotAllowed}
                  </div>
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
