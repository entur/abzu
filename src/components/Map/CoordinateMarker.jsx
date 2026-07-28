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

import L from "leaflet";
import React from "react";
import { injectIntl } from "react-intl";
import { Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";
import { UserActions } from "../../actions/";
import coordinatesIcon from "../../static/icons/coordinates-marker.png";
import mapCenterIcon from "../../static/icons/map-center.png";
import mapZoomIn from "../../static/icons/map-zoom-in.png";

class CoordinateMarker extends React.Component {
  handleDragEnd(e) {
    const latLng = e.target.getLatLng();
    if (latLng) {
      const { lat, lng } = latLng;
      this.props.dispatch(UserActions.lookupCoordinates([lat, lng], true));
    }
  }

  handleChangeCoordinates() {
    this.props.dispatch(UserActions.openLookupCoordinatesDialog());
  }

  handleZoomIn() {
    const { position, dispatch } = this.props;
    dispatch(UserActions.setCenterAndZoom(position, 17));
  }

  handleAutoPan() {
    const { position, dispatch } = this.props;
    dispatch(UserActions.setCenterAndZoom(position, 5));
  }

  render() {
    const { position, intl } = this.props;
    const { formatMessage } = intl;

    var icon = L.icon({
      iconUrl: coordinatesIcon,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, 0],
    });

    const imageStyle = {
      height: 18,
      width: 18,
      border: "1px solid",
      borderRadius: "50%",
      padding: 3,
      cursor: "pointer",
      marginLeft: 5,
      marginRight: 5,
    };

    return (
      <Marker
        draggable={true}
        position={position}
        icon={icon}
        eventHandlers={{
          dragend: (e) => handleDragEnd(e),
        }}
      >
        <Popup autoPan={false}>
          <div>
            <div style={{ fontWeight: 600, textAlign: "center" }}>
              {formatMessage({ id: "lookup_coordinates" })}
            </div>
            <div
              style={{
                marginTop: 10,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={this.handleChangeCoordinates.bind(this)}
            >
              <span style={{ borderBottom: "1px dotted" }}>
                {position.join(",")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <img
                alt=""
                onClick={this.handleAutoPan.bind(this)}
                src={mapCenterIcon}
                style={imageStyle}
              />
              <img
                alt=""
                onClick={this.handleZoomIn.bind(this)}
                src={mapZoomIn}
                style={imageStyle}
              />
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default injectIntl(connect(null)(CoordinateMarker));
