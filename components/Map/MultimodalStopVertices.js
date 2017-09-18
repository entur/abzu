import React, {Component} from 'react';
import { Polyline, Popup, FeatureGroup } from 'react-leaflet';


class MultimodalStopVertices extends Component {
  render() {

    const { stops } = this.props;
    let vertices = [];

    stops.forEach( (marker, index) => {
      if (marker.isParent) {
          if (marker.children) {
            marker.children.forEach( (child, childIndex) => {
              vertices.push(
                <Polyline
                  key={'vertex-' + index + '-' + childIndex}
                  positions={[marker.location, child.location]}
                  color={"green"}
                  dashArray="8,2"
                  weight={1}
                />
              );
            });
          }
      }
    });

    return (
      <FeatureGroup>
        <div>
          {vertices.length ? vertices : null}
        </div>
      </FeatureGroup>
    );
  }
}

export default MultimodalStopVertices;
