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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import AdjacentStopConnection from './AdjacentStopConnection';

class AdjacentStopList extends Component {

  render() {
    if (!this.props.stopPlace.adjacentSites) {
      return null;
    }

    const { formatMessage } = this.props.intl;

    const stopPlaceId = this.props.stopPlace.id;

    const refs = this.props.stopPlace.adjacentSites.map(adjacentRef => {
      const key = adjacentRef.ref + "-" + stopPlaceId;
      return <AdjacentStopConnection
        key={key}
        stopPlace={this.props.stopPlace}
        adjacentRef={adjacentRef.ref}
        handleRemoveAdjacentConnection={this.props.handleRemoveAdjacentConnection}
      />
    }
    );

    return (
      <div>
        {refs.length > 0 &&
          <span style={{ fontWeight: 600, fontSize: '0.8em' }}>
            {formatMessage({id:'connected_with_adjacent_stop_places'})}
        </span>}
        {refs}
      </div>
    );
  }
}

AdjacentStopList.propTypes = {
  stopPlace: PropTypes.object.isRequired,
  handleRemoveAdjacentConnection: PropTypes.func.isRequired
};

export default injectIntl(AdjacentStopList);

