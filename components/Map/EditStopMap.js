import { connect } from 'react-redux';
import React from 'react';
import LeafletMap from '../components/Map/LeafletMap';
import { StopPlaceActions, UserActions } from '../actions/';
import { injectIntl } from 'react-intl';
import { setDecimalPrecision } from '../utils';
import CoordinatesDialog from '../components/Dialogs/CoordinatesDialog';
import CompassBearingDialog from '../components/Dialogs/CompassBearingDialog';
import debounce from 'lodash.debounce';
import { withApollo } from 'react-apollo';
import { getNeighbourStops } from '../graphql/Actions';
import Settings from '../singletons/SettingsManager';

class EditStopMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinatesDialogOpen: false,
      compassBearingDialogOpen: false,
    };
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
      document.querySelector('.leaflet-container').style.cursor = 'crosshair';
    } else {
      document.querySelector('.leaflet-container').style.cursor = '';
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
          index,
          'quay',
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
    this.props.dispatch(UserActions.setZoomLevel(event.target.getZoom()));
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value));
  }

  handleChangeCoordinates(isQuay, markerIndex, position) {
    this.setState({
      coordinatesDialogOpen: true,
      coordinates: position.join(','),
      coordinatesOwner: {
        isQuay: isQuay,
        markerIndex: markerIndex,
      },
    });
  }

  handleSubmitChangeCoordinates(position) {
    const { coordinatesOwner } = this.state;
    const { dispatch } = this.props;

    if (coordinatesOwner.isQuay) {
      dispatch(
        StopPlaceActions.changeElementPosition(
          coordinatesOwner.markerIndex,
          'quay',
          position,
        ),
      );
    } else {
      dispatch(StopPlaceActions.changeCurrentStopPosition(position));
    }

    dispatch(StopPlaceActions.changeMapCenter(position, 14));

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

  componentDidMount() {
    const { leafletElement } = this.refs.leafletMap.refs.map;
    const { dispatch, client, ignoreStopId } = this.props;
    dispatch(StopPlaceActions.setActiveMap(leafletElement));
    const bounds = leafletElement.getBounds();
    let includeExpired = new Settings().getShowExpiredStops();
    getNeighbourStops(client, ignoreStopId, bounds, includeExpired);
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
          ref="leafletMap"
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

const mapStateToProps = state => {
  const currentStopPlace = state.stopPlace.current;
  const neighbourStops = state.stopPlace.neighbourStops;

  let markers = [];

  if (currentStopPlace) {
    markers = markers.concat(currentStopPlace);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(neighbourStops);
  }

  return {
    position: state.stopPlace.centerPosition,
    zoom: state.stopPlace.zoom,
    activeBaselayer: state.user.activeBaselayer,
    enablePolylines: state.stopPlace.enablePolylines,
    isCreatingPolylines: state.stopPlace.isCreatingPolylines,
    missingCoordsMap: state.user.missingCoordsMap,
    markers: markers,
    ignoreStopId: state.stopPlace.current ? state.stopPlace.current.id : -1,
    minZoom: state.stopPlace.minZoom,
  };
};

export default withApollo(injectIntl(connect(mapStateToProps)(EditStopMap)));
