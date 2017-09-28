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
import { getIdFromURL } from '../utils/URLhelpers';
import { getStopPlaceById } from '../graphql/Actions';
import { withApollo } from 'react-apollo';
import formatHelpers from '../modelUtils/mapToClient';
import StopPlaceActions from '../actions/StopPlaceActions';
import { removeIdParamFromURL, updateURLWithId } from '../utils/URLhelpers';
import '../styles/main.css';
import Loader from '../components/Dialogs/Loader';

class StopPlaces extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    const { activeSearchResult, client, dispatch } = this.props;
    const idFromURL = getIdFromURL();
    if (!activeSearchResult && idFromURL) {
      this.setState({isLoading: true});

      getStopPlaceById(client, idFromURL).then(({data}) => {
        this.setState({isLoading: false});
        if (data.stopPlace && data.stopPlace.length) {
          const stopPlaces = formatHelpers.mapSearchResultatToClientStops(data.stopPlace);
          if (stopPlaces.length) {
            dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));;
          } else {
            removeIdParamFromURL();
          }
        } else {
          removeIdParamFromURL();
        }
      }).catch( err => {
        removeIdParamFromURL();
        this.setState({isLoading: false});
      });
    } else if (!idFromURL && activeSearchResult && activeSearchResult.id) {
      updateURLWithId(activeSearchResult.id);
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading && <Loader/> }
        <SearchBox />
        <StopPlacesMap />
      </div>
    );
  }
};

const mapStateToProps = ({stopPlace}) => ({
  activeSearchResult: stopPlace.activeSearchResult
});

export default withApollo(connect(mapStateToProps)(StopPlaces));
