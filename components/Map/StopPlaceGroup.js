import React, { Component } from 'react';
import { Polygon, Popup } from 'react-leaflet';
import { sortPolygonByAngles } from '../../utils/mapUtils';

class StopPlaceGroup extends Component {

  render() {

    const positions = sortPolygonByAngles(this.props.positions);

    if (positions == null) return null;

    const polygonData = [positions];

    return (
      <Polygon positions={polygonData}>
        <Popup>
          <div>{this.props.name}</div>
        </Popup>
      </Polygon>
    );
  }
}

export default StopPlaceGroup;
