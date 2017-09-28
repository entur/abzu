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


import { connect } from 'react-redux';
import React from 'react';
import LeafletMap from './LeafletMap';
import { StopPlaceActions, UserActions } from '../../actions/';
import { withApollo } from 'react-apollo';
import { getIn } from '../../utils/';
import { injectIntl } from 'react-intl';
import { getNeighbourStops } from '../../graphql/Actions';
import Settings from '../../singletons/SettingsManager';
import debounce from 'lodash.debounce';
import { getMarkersForMap } from '../../selectors/StopPlaceMap';

class StopPlacesMap extends React.Component {

  constructor(props) {
    super(props);
    this.getNearbyStops = debounce(getNeighbourStops, 500);
  }

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

  handleZoomEnd(event) {
    this.props.dispatch(UserActions.setZoomLevel(event.target.getZoom()));
  }

  handleBaselayerChanged(value) {
    this.props.dispatch(UserActions.changeActiveBaselayer(value));
  }

  handleMapMoveEnd(event, { leafletElement }) {
    const zoom = leafletElement.getZoom();
    const center = leafletElement.getCenter();

    let includeExpired = new Settings().getShowExpiredStops();

    const { dispatch } = this.props;

    dispatch(UserActions.setCenterAndZoom([center.lat, center.lng], null));

    if (zoom > 14) {
      const bounds = leafletElement.getBounds();
      const { ignoreStopId, client } = this.props;
      this.getNearbyStops(client, ignoreStopId, bounds, includeExpired);
    } else {
      const { neighbourMarkersCount } = this.props;
      if (neighbourMarkersCount) {
        dispatch(UserActions.removeStopsNearbyForOverview());
      }
    }
  }

  render() {
    const { position, markers, zoom } = this.props;

    return (
      <LeafletMap
        position={position}
        markers={markers}
        zoom={zoom}
        handleZoomEnd={this.handleZoomEnd.bind(this)}
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
  return {
    position: state.stopPlace.centerPosition,
    neighbourMarkersCount: state.stopPlace.neighbourStops ? state.stopPlace.neighbourStops.length : 0,
    markers: getMarkersForMap(state),
    kc: state.roles.kc,
    zoom: state.stopPlace.zoom,
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
