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
