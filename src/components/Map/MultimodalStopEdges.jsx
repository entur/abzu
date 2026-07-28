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

import { Component } from "react";
import { FeatureGroup, Polyline } from "react-leaflet";
import { connect } from "react-redux";
import { getCoordinatesFromGeometry } from "../../utils/";

class MultimodalStopEdges extends Component {
  render() {
    const { stops, showMultimodalEdges } = this.props;
    let vertices = [];

    if (!showMultimodalEdges) return null;

    let foundMarkers = [];

    let validParentStops = stops.filter(
      (marker) =>
        marker.isParent &&
        marker.location &&
        marker.children &&
        marker.children.length,
    );

    validParentStops.forEach((marker, index) => {
      if (foundMarkers.indexOf(marker.id) === -1 || !marker.id) {
        marker.children
          .filter((child) => child.location && child.location.length === 2)
          .map((child) => {
            let newChild = Object.assign({}, child);
            if (child.geometry && !child.location) {
              newChild.location = getCoordinatesFromGeometry(child.geometry);
            }
            return newChild;
          })
          .forEach((child, childIndex) => {
            vertices.push(
              <Polyline
                key={"vertex-" + index + "-" + childIndex}
                positions={[marker.location, child.location]}
                opacity={0.9}
                color={"lime"}
                dashArray="16,2"
                weight={3}
              />,
            );
          });
        foundMarkers.push(marker.id);
      }
    });

    return (
      <FeatureGroup>
        <div>{vertices && vertices.length ? vertices : null}</div>
      </FeatureGroup>
    );
  }
}

const mapStateToProps = ({ stopPlace }) => ({
  showMultimodalEdges: stopPlace.showMultimodalEdges,
});

export default connect(mapStateToProps)(MultimodalStopEdges);
