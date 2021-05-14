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

import React from "react";
import compassBearingIcon from "../../static/icons/compass-bearing.png";
const markerIcon = require("../../static/icons/quay-marker-background.png")
  .default;

class QuayMarkerIcon extends React.Component {
  componentWillMount() {
    const {
      focusedElement,
      index,
      belongsToNeighbourStop,
      compassBearing,
    } = this.props;

    let markerIconStyle = {};

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = "grayscale(100%)";
      markerIconStyle.opacity = "0.8";
    }

    this._shouldBeFocused =
      focusedElement.type === "quay" && index === focusedElement.index;
    this._markerIcon = (
      <img
        alt=""
        src={markerIcon}
        style={markerIconStyle}
        className={this._shouldBeFocused ? "focused-quay" : ""}
      />
    );
    this._compassBearingIcon = (
      <img
        alt=""
        style={{
          width: 20,
          height: 20,
          marginLeft: 2,
          position: "absolute",
          marginTop: -18,
          transform: `rotate(${compassBearing}deg) scale(0.7)`,
        }}
        src={compassBearingIcon}
      />
    );
  }

  render() {
    const {
      displayCode,
      compassBearing,
      isCompassBearingEnabled,
      defaultValueIcon,
    } = this.props;
    const quayShortName = getShortQuayName(displayCode) || defaultValueIcon;
    const nameLen = quayShortName.length;

    const quayStyle = {
      color: "#fff",
      position: "absolute",
      top: 4,
      left: -4,
      zIndex: 9999,
    };

    return (
      <div>
        {isCompassBearingEnabled && typeof compassBearing === "number"
          ? this._compassBearingIcon
          : null}
        {this._markerIcon}
        <div style={quayStyle}>
          <div
            style={{
              width: 30,
              fontSize: nameLen > 2 ? 10 : 12,
              textAlign: "center",
            }}
          >
            {quayShortName}
          </div>
        </div>
      </div>
    );
  }
}

export default QuayMarkerIcon;

const getShortQuayName = (quayName) => {
  if (!isNaN(quayName)) return quayName;
  return quayName.length > 3 ? quayName.substring(0, 3) : quayName;
};
