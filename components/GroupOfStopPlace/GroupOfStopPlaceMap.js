import React, {Component} from 'react';
import LeafletMap from '../Map/LeafletMap';
import { connect } from 'react-redux';

class GroupOfStopPlaceMap extends Component {
  render() {

    const { position, activeBaselayer, enablePolylines, zoom } = this.props;

    return (
      <LeafletMap
        position={position}
        markers={[]}
        zoom={zoom}
        boundsOptions={{ padding: [50, 50] }}
        ref="leafletMap"
        key="leafletmap-edit"
        handleOnClick={()=> {}}
        handleDragEnd={()=> {}}
        handleMapMoveEnd={()=> {}}
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

const mapStateToProps = ({stopPlace, user}) => ({
  zoom: stopPlace.zoom,
  activeBaselayer: user.activeBaselayer,
  enablePolylines: stopPlace.enablePolylines,
  position: stopPlace.centerPosition
});

export default connect(mapStateToProps)(GroupOfStopPlaceMap);

