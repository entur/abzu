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
import EditorInsertLink from 'material-ui/svg-icons/editor/insert-link';
import MdDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import StopPlaceActions from '../../actions/StopPlaceActions';

class AdjacentStopList extends Component {

  handleRemoveAdjacentConnection(adjacentRef) {
    this.props.handleRemoveAdjacentConnection(this.props.stopPlace.id, adjacentRef);
  }

  render() {
    if(!this.props.stopPlace.adjacentSites) {
      return null;
    }

    const stopPlaceId = this.props.stopPlace.id;

    const refs = this.props.stopPlace.adjacentSites.map(adjacentRef => {
      const key = adjacentRef.ref + "-" + stopPlaceId;
      return <div style={{fontSize: 13, textAlign: 'top'}} key={key}>
        <EditorInsertLink
            style={{transform: 'scale(0.6)' }}
        />
        <span style={{marginTop: -20}}>{adjacentRef.ref}</span>
        <IconButton
          onClick={() => this.handleRemoveAdjacentConnection(adjacentRef)}
          style={{transform: 'scale(0.6)'}}
          tooltip='remove link'
          >
            <MdDelete />
        </IconButton>
      </div>
      }
    );

    return (
      <div>
        {refs.length > 0 &&
        <span style={{fontWeight: 600, fontSize: '0.8em' }}>
          This stop place is linked with adjacent stop places
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

