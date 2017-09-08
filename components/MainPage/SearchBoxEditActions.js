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
