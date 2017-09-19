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

import React, {Component} from 'react';
import { Polyline, FeatureGroup } from 'react-leaflet';
import { connect } from 'react-redux';
import { getCoordinatesFromGeometry } from '../../utils/';

class MultimodalStopEdges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeLine: null
    }
  }

  render() {

    const { stops, showMultimodalEdges } = this.props;
    let vertices = [];

    if (!showMultimodalEdges) return null;

    stops.forEach( (marker, index) => {
      if (marker.isParent && marker.location) {
          if (marker.children) {
            marker.children
              .map( child => {
                if (child.geometry && !child.location) {
                  child.location = getCoordinatesFromGeometry(child.geometry);
                }
                return child;
              })
              .filter(child => child.location && child.location.length === 2)
              .forEach( (child, childIndex) => {
              const markerIndex = marker.id + child.id;
              vertices.push(
                <Polyline
                  key={'vertex-' + index + '-' + childIndex}
                  positions={[marker.location, child.location]}
                  opacity={this.state.activeLine === markerIndex ? 1: 0.8}
                  color={"lime"}
                  dashArray="16,2"
                  onMouseOver={ e => {
                    if (this.state.activeLine !== markerIndex) {
                      this.setState({
                        activeLine: markerIndex
                      });
                      e.target.bringToFront();
                    }
                  }}
                  onMouseOut={() => {
                    if (this.state.activeLine === markerIndex) {
                      this.setState({
                        activeLine: null
                      });
                  }}}
                  weight={this.state.activeLine === markerIndex ? 4: 2}
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

const mapStateToProps = ({stopPlace}) => ({
  showMultimodalEdges: stopPlace.showMultimodalEdges
});

export default connect(mapStateToProps)(MultimodalStopEdges);
