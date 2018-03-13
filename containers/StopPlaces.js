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

import React from 'react';
import { connect } from 'react-redux';
import SearchBox from '../components/MainPage/SearchBox';
import StopPlacesMap from '../components/Map/StopPlacesMap';
import { getStopPlaceById, getGroupOfStopPlacesById } from '../graphql/Tiamat/actions';
import { withApollo } from 'react-apollo';
import formatHelpers from '../modelUtils/mapToClient';
import StopPlaceActions from '../actions/StopPlaceActions';
import { removeIdParamFromURL, updateURLWithId, getStopPlaceIdFromURL, getGroupOfStopPlacesIdFromURL } from '../utils/URLhelpers';
import '../styles/main.css';
import Loader from '../components/Dialogs/Loader';

class StopPlaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  handleGroupOfStopPlace(groupOfStopPlaceId) {
    this.setState({ isLoading: true });
    const { client, dispatch } = this.props;
    getGroupOfStopPlacesById(client, groupOfStopPlaceId).then(({data}) => {
      if (data.groupOfStopPlaces && data.groupOfStopPlaces.length) {
        const groupOfStopPlace = formatHelpers.mapSearchResultatGroup(data.groupOfStopPlaces);
        dispatch(StopPlaceActions.setMarkerOnMap(groupOfStopPlace[0]));
      } else {
        removeIdParamFromURL('groupOfStopPlacesId');
      }
      this.setState({ isLoading: false });
    }).catch(err => {
      this.setState({ isLoading: false });
    });
  }


  handleLoadStopPlace(props, stopPlaceId, forceLoad) {
    const { activeSearchResult, client, dispatch } = props;

    if (forceLoad || (!activeSearchResult && stopPlaceId)) {
      this.setState({ isLoading: true });

      getStopPlaceById(client, stopPlaceId)
        .then(({ data }) => {
          this.setState({ isLoading: false });
          if (data.stopPlace && data.stopPlace.length) {
            const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
              data.stopPlace
            );
            if (stopPlaces.length) {
              dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
            } else {
              removeIdParamFromURL('stopPlaceId');
            }
          } else {
            removeIdParamFromURL('stopPlaceId');
          }
        })
        .catch(err => {
          removeIdParamFromURL('stopPlaceId');
          this.setState({ isLoading: false });
        });
    } else if (!stopPlaceId && activeSearchResult && activeSearchResult.id) {
      updateURLWithId('stopPlaceId', activeSearchResult.id);
    }
  }

  componentDidMount() {
    const { lastMutatedStopPlaceId, activeSearchResult, dispatch } = this.props;
    const searchResultId = activeSearchResult ? activeSearchResult.id : null;
    const shouldRefreshStopPlace =
      (lastMutatedStopPlaceId.length && searchResultId !== null) &&
      (lastMutatedStopPlaceId.indexOf(searchResultId) > -1);

    const stopPlaceIdFromURL = getStopPlaceIdFromURL();
    const groupOfStopPlacesFromURL = getGroupOfStopPlacesIdFromURL();

    const stopPlaceId = shouldRefreshStopPlace
      ? searchResultId
      : stopPlaceIdFromURL;

    if (shouldRefreshStopPlace) {
      dispatch(StopPlaceActions.clearLastMutatedStopPlaceId());
    }

    if (groupOfStopPlacesFromURL) {
      this.handleGroupOfStopPlace(groupOfStopPlacesFromURL);
    } else {
      this.handleLoadStopPlace(
        this.props,
        stopPlaceId,
        shouldRefreshStopPlace
      );
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading && <Loader />}
        <SearchBox />
        <StopPlacesMap />
      </div>
    );
  }
}

const mapStateToProps = ({ stopPlace, user }) => ({
  activeSearchResult: stopPlace.activeSearchResult,
  lastMutatedStopPlaceId: stopPlace.lastMutatedStopPlaceId,
  currentPath: user.path
});

export default withApollo(connect(mapStateToProps)(StopPlaces));
