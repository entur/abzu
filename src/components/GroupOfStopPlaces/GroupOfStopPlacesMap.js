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
import LeafletMap from '../Map/LeafletMap';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { getNeighbourStops } from '../../graphql/Tiamat/actions';
import { withApollo } from 'react-apollo';
import Settings from '../../singletons/SettingsManager';

class GroupOfStopPlaceMap extends Component {

  constructor(props) {
    super(props);

    const mapEnd = (event, { leafletElement }) => {
      let { ignoreStopId, client } = this.props;

      const zoom = leafletElement.getZoom();

      if (zoom > 12) {
        const bounds = leafletElement.getBounds();
        let includeExpired = new Settings().getShowExpiredStops();
        getNeighbourStops(client, ignoreStopId, bounds, includeExpired);
      }
    };
    this.handleMapMoveEnd = debounce(mapEnd, 500);
  }

  render() {

    const { position, activeBaselayer, enablePolylines, zoom, markers } = this.props;

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        boundsOptions={{ padding: [50, 50] }}
        ref="leafletMap"
        key="leafletmap-edit"
        handleOnClick={()=> {}}
        handleDragEnd={()=>{}}
        handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
        handleChangeCoordinates={()=> {}}
        dragableMarkers={false}
        activeBaselayer={activeBaselayer}
        handleBaselayerChanged={()=> {}}
        enablePolylines={enablePolylines}
        handleZoomEnd={()=> {}}
        handleSetCompassBearing={()=> {}}
      />
    );
  }
}

const mapStateToProps = ({stopPlace, user, stopPlacesGroup}) => ({
  activeBaselayer: user.activeBaselayer,
  enablePolylines: stopPlace.enablePolylines,
  ignoreStopId: stopPlacesGroup.current.id,
  markers: stopPlacesGroup.current.members.concat(stopPlace.neighbourStops || []).filter(m => !m.permanentlyTerminated),
});

export default withApollo(connect(mapStateToProps)(GroupOfStopPlaceMap));
