import React, { Component } from 'react';
import { Polygon, Popup } from 'react-leaflet';

class StopPlaceGroup extends Component {
  render() {
    return (
      <Polygon positions={this.props.positions}>
        <Popup>
          <div>{this.props.name}</div>
        </Popup>
      </Polygon>
    );
  }
}

export default StopPlaceGroup;
