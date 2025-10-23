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

import debounce from "lodash.debounce";
import { Component } from "react";
import { connect } from "react-redux";
import { getNeighbourStops } from "../../actions/TiamatActions";
import Settings from "../../singletons/SettingsManager";
import LeafletMap from "../Map/LeafletMap";

class GroupOfStopPlaceMap extends Component {
  constructor(props) {
    super(props);

    const mapEnd = (event, map) => {
      let { ignoreStopId, dispatch } = this.props;

      const zoom = map.getZoom();

      if (zoom > 12) {
        const bounds = map.getBounds();
        let includeExpired = new Settings().getShowExpiredStops();
        dispatch(getNeighbourStops(ignoreStopId, bounds, includeExpired));
      }
    };
    this.handleMapMoveEnd = debounce(mapEnd, 500);
  }

  render() {
    const {
      position,
      activeBaselayer,
      enablePolylines,
      zoom,
      markers,
      uiMode,
    } = this.props;

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        boundsOptions={{ padding: [50, 50] }}
        key="leafletmap-edit"
        handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
        dragableMarkers={false}
        activeBaselayer={activeBaselayer}
        enablePolylines={enablePolylines}
        handleDragEnd={() => {}}
        uiMode={uiMode}
      />
    );
  }
}

const mapStateToProps = ({ stopPlace, user, stopPlacesGroup }) => ({
  activeBaselayer: user.activeBaselayer,
  enablePolylines: stopPlace.enablePolylines,
  ignoreStopId: stopPlacesGroup.current.id,
  markers: stopPlacesGroup.current.members
    .concat(stopPlace.neighbourStops || [])
    .filter((m) => !m.permanentlyTerminated),
  uiMode: user.uiMode,
});

export default connect(mapStateToProps)(GroupOfStopPlaceMap);
