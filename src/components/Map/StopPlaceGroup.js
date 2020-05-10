import React, { Component } from "react";
import { Polygon, Popup } from "react-leaflet";
import { sortPolygonByAngles } from "../../utils/mapUtils";

class StopPlaceGroup extends Component {
  render() {
    const positions = sortPolygonByAngles(this.props.positions);

    if (!positions) return null;

    return (
      <Polygon positions={[positions]}>
        <Popup>
          <div>{this.props.name}</div>
        </Popup>
      </Polygon>
    );
  }
}

export default StopPlaceGroup;
