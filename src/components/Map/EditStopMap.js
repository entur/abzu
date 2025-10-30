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
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { StopPlaceActions, UserActions } from "../../actions/";
import { getNeighbourStops } from "../../actions/TiamatActions";
import Settings from "../../singletons/SettingsManager";
import { setDecimalPrecision } from "../../utils";
import CompassBearingDialog from "../Dialogs/CompassBearingDialog";
import CoordinatesDialog from "../Dialogs/CoordinatesDialog";
import LeafletMap from "./LeafletMap";

class EditStopMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinatesDialogOpen: false,
      compassBearingDialogOpen: false,
    };
    const mapEnd = (event, map) => {
      let { ignoreStopId, dispatch } = this.props;

      const zoom = map.getZoom();
      const center = map.getCenter();

      dispatch(UserActions.setCenterAndZoom([center.lat, center.lng], zoom));

      if (zoom > 12) {
        const bounds = map.getBounds();
        let includeExpired = new Settings().getShowExpiredStops();
        dispatch(getNeighbourStops(ignoreStopId, bounds, includeExpired));
      }
    };
    this.handleMapMoveEnd = debounce(mapEnd, 500);
  }

  handleMapOnClick(event, map) {
    const { isCreatingPolylines, dispatch } = this.props;

    if (isCreatingPolylines) {
      const coords = [event.latlng.lat, event.latlng.lng];
      dispatch(UserActions.addCoordinatesToPolylines(coords));
    }
  }

  handleCoordinatesDialogClose() {
    this.setState({
      coordinatesDialogOpen: false,
    });
  }

  handleCompassBearingDialogClose() {
    this.setState({
      compassBearingDialogOpen: false,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isCreatingPolylines) {
      document.querySelector(".leaflet-container").style.cursor = "crosshair";
    } else {
      document.querySelector(".leaflet-container").style.cursor = "";
    }

    return true;
  }

  handleMapDragEnd(isQuay, index, event) {
    const { dispatch } = this.props;
    const position = event.target.getLatLng();

    let formattedPosition = [
      setDecimalPrecision(position.lat, 6),
      setDecimalPrecision(position.lng, 6),
    ];

    if (isQuay) {
      dispatch(
        StopPlaceActions.changeElementPosition(
          {
            markerIndex: index,
            type: "quay",
          },
          formattedPosition,
        ),
      );
    } else {
      dispatch(StopPlaceActions.changeCurrentStopPosition(formattedPosition));
    }
  }

  handleSetCompassBearing(compassBearing, index) {
    this.setState({
      compassBearingDialogOpen: true,
      compassBearing: compassBearing,
      compassBearingOwner: index,
    });
  }

  handleZoomEnd(event) {
    const center = event.target.getCenter();
    this.props.dispatch(
      UserActions.setCenterAndZoom(
        [center.lat, center.lng],
        event.target.getZoom(),
      ),
    );
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value));
  }

  handleChangeCoordinates(coordinatesOwner, position) {
    this.setState({
      coordinatesDialogOpen: true,
      coordinates: position.join(","),
      coordinatesOwner,
    });
  }

  handleSubmitChangeCoordinates(position) {
    const { coordinatesOwner } = this.state;
    const { dispatch, zoom } = this.props;

    if (coordinatesOwner.type === "stop-place") {
      dispatch(StopPlaceActions.changeCurrentStopPosition(position));
    } else {
      dispatch(
        StopPlaceActions.changeElementPosition(coordinatesOwner, position),
      );
    }

    dispatch(StopPlaceActions.changeMapCenter(position, zoom));

    this.setState({
      coordinatesDialogOpen: false,
    });
  }

  handleSubmitChangeCompassBearing(compassBearing) {
    const { compassBearingOwner } = this.state;
    this.props.dispatch(
      StopPlaceActions.changeQuayCompassBearing(
        compassBearingOwner,
        compassBearing,
      ),
    );
    this.setState({
      compassBearingDialogOpen: false,
    });
  }

  onMapReady(map) {
    const { dispatch, ignoreStopId } = this.props;
    dispatch(StopPlaceActions.setActiveMap(map));
    const bounds = map.getBounds();
    let includeExpired = new Settings().getShowExpiredStops();
    dispatch(getNeighbourStops(ignoreStopId, bounds, includeExpired));
  }

  render() {
    const { position, markers, zoom, minZoom, disabled } = this.props;
    const { coordinatesDialogOpen, compassBearingDialogOpen } = this.state;

    return (
      <div>
        <LeafletMap
          position={position}
          markers={markers}
          zoom={zoom}
          boundsOptions={{ padding: [50, 50] }}
          onMapReady={this.onMapReady.bind(this)}
          key="leafletmap-edit"
          handleOnClick={this.handleMapOnClick.bind(this)}
          handleDragEnd={this.handleMapDragEnd.bind(this)}
          handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
          handleChangeCoordinates={this.handleChangeCoordinates.bind(this)}
          dragableMarkers={!disabled}
          activeBaselayer={this.props.activeBaselayer}
          handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
          enablePolylines={this.props.enablePolylines}
          minZoom={minZoom}
          handleZoomEnd={this.handleZoomEnd.bind(this)}
          handleSetCompassBearing={this.handleSetCompassBearing.bind(this)}
          uiMode={this.props.uiMode}
        />
        <CoordinatesDialog
          intl={this.props.intl}
          open={coordinatesDialogOpen}
          coordinates={this.state.coordinates}
          handleClose={this.handleCoordinatesDialogClose.bind(this)}
          handleConfirm={this.handleSubmitChangeCoordinates.bind(this)}
        />
        <CompassBearingDialog
          open={compassBearingDialogOpen}
          intl={this.props.intl}
          compassBearing={this.state.compassBearing}
          handleClose={this.handleCompassBearingDialogClose.bind(this)}
          handleConfirm={this.handleSubmitChangeCompassBearing.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currentStopPlace = state.stopPlace.current;
  const neighbourStops = state.stopPlace.neighbourStops;

  let markers = [];

  if (currentStopPlace) {
    markers = markers.concat(currentStopPlace);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(
      neighbourStops.filter((m) => !m.permanentlyTerminated),
    );
  }

  return {
    position: state.stopPlace.centerPosition,
    zoom: state.stopPlace.zoom,
    activeBaselayer: state.user.activeBaselayer,
    enablePolylines: state.stopPlace.enablePolylines,
    isCreatingPolylines: state.stopPlace.isCreatingPolylines,
    missingCoordsMap: state.user.missingCoordsMap,
    markers,
    ignoreStopId: state.stopPlace.current ? state.stopPlace.current.id : -1,
    minZoom: state.stopPlace.minZoom,
    uiMode: state.user.uiMode,
  };
};

export default injectIntl(connect(mapStateToProps)(EditStopMap));
