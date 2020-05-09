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

class AdjacentStopConnection extends Component {

  handleRemoveAdjacentConnection = () => {
    this.props.handleRemoveAdjacentConnection(this.props.stopPlace.id, this.props.adjacentRef);
  }

  render() {
    const adjacentRef = this.props.adjacentRef;
    const style = {
      display: 'flex',
      alignItems: 'center',
      padding: 8
    }

    return (
        <div style={style}>
          <EditorInsertLink />
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}>
            <div style={{ fontSize: '0.7em', marginTop: 5 }}>{adjacentRef}</div>
          </div>
        <IconButton
          onClick={this.handleRemoveAdjacentConnection}
        >
          <MdDelete />
        </IconButton>
      </div>
    )
  }
}

AdjacentStopConnection.propTypes = {
  stopPlace: PropTypes.object.isRequired,
  adjacentRef: PropTypes.string.isRequired,
  handleRemoveAdjacentConnection: PropTypes.func.isRequired
};

export default injectIntl(AdjacentStopConnection);

