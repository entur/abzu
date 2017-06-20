import { connect } from 'react-redux';
import React from 'react';
import LeafletMap from '../components/LeafletMap';
import { StopPlaceActions, UserActions } from '../actions/';
import { withApollo } from 'react-apollo';
import { getIn } from '../utils/';
import { injectIntl } from 'react-intl';
import { getNeighbourStops } from '../graphql/Actions';
import Settings from '../singletons/SettingsManager';

class StopPlacesMap extends React.Component {
  componentDidMount() {
    const { formatMessage } = this.props.intl;
    document.title = formatMessage({ id: '_title' });
  }

  componentWillUpdate(nextProps) {
    if (this.props.intl.locale !== nextProps.intl.locale) {
      const { formatMessage } = nextProps.intl;
      document.title = formatMessage({ id: '_title' });
    }
  }

  handleClick(e, map) {
    const { isCreatingNewStop } = this.props;

    if (isCreatingNewStop) {
      map.leafletElement.doubleClickZoom.disable();
      this.props.dispatch(StopPlaceActions.createNewStop(e.latlng));
    } else {
      map.leafletElement.doubleClickZoom.enable();
    }
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value));
  }

  handleMapMoveEnd(event, { leafletElement }) {
    const zoom = leafletElement.getZoom();

    let includeExpired = new Settings().getShowExpiredStops()

    if (zoom > 14) {
      const bounds = leafletElement.getBounds();
      const { ignoreStopId, client } = this.props;
      getNeighbourStops(client, ignoreStopId, bounds, includeExpired);
    } else {
      this.props.dispatch(UserActions.removeStopsNearbyForOverview());
    }
  }

  render() {
    const { position, markers, zoom } = this.props;

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        onDoubleClick={this.handleClick.bind(this)}
        handleDragEnd={() => {}}
        handleMapMoveEnd={this.handleMapMoveEnd.bind(this)}
        dragableMarkers={false}
        activeBaselayer={this.props.activeBaselayer}
        handleBaselayerChanged={this.handleBaselayerChanged.bind(this)}
        enablePolylines={false}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    newStop,
    centerPosition,
    activeSearchResult,
    zoom,
    neighbourStops,
  } = state.stopPlace;

  const { isCreatingNewStop } = state.user;

  let markers = activeSearchResult ? [activeSearchResult] : [];

  if (newStop && isCreatingNewStop) {
    markers = markers.concat(newStop);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(neighbourStops);
  }

  return {
    position: centerPosition,
    markers: markers,
    zoom: zoom,
    isCreatingNewStop: state.user.isCreatingNewStop,
    activeBaselayer: state.user.activeBaselayer,
    ignoreStopId: getIn(
      state.stopPlace,
      ['activeSearchResult', 'id'],
      undefined,
    ),
  };
};

export default withApollo(injectIntl(connect(mapStateToProps)(StopPlacesMap)));
