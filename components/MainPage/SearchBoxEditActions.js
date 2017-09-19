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

import React, {Component} from 'react';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';


class SearchBoxEditAction extends Component {
  render() {

    const { canEdit, handleEdit, text, result } = this.props;

    return (
      <div style={{ width: '100%', textAlign: 'right' }}>
        <FlatButton
          onClick={() => handleEdit(result.id)}
          style={{ marginTop: 0 }}
        >
          {canEdit
            ? <Edit
              style={{ width: 16, verticalAlign: 'middle', height: 16 }}
            />
            : <MapsMyLocation
              style={{ width: 16, verticalAlign: 'middle', height: 16 }}
            />}
          <span style={{ fontSize: '.8em', marginLeft: 5 }}>
            {canEdit ? text.edit : text.view}
          </span>
        </FlatButton>
      </div>
    );
  }
}

export default SearchBoxEditAction;
