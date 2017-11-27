import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import GroupOfStopPlacesList from './GroupOfStopPlacesList';
import {StopPlacesGroupActions} from '../../actions/';
import { connect } from 'react-redux';

class GroupOfStopPlacesDetails extends Component {

  handleChangeName(e, name) {
    this.props.dispatch(
      StopPlacesGroupActions.changeName(name)
    );
  }

  handleChangeDescription(e, description) {
    this.props.dispatch(
      StopPlacesGroupActions.changeDescription(description)
    );
  }

  render() {

    const { name, description, formatMessage, canEdit } = this.props;

    return (
      <div style={{padding: 5, minHeight: 400}}>
        <TextField
          floatingLabelText={formatMessage({id: 'name'})}
          fullWidth={true}
          errorText={name ? '' : formatMessage({id: 'name_is_required'})}
          value={name}
          disabled={!canEdit}
          onChange={this.handleChangeName.bind(this)}
        />
        <TextField
          floatingLabelText={formatMessage({id: 'description'})}
          fullWidth={true}
          disabled={!canEdit}
          value={description}
          onChange={this.handleChangeDescription.bind(this)}
        />
        <Divider/>
        <GroupOfStopPlacesList canEdit={canEdit} stopPlaces={this.props.members}/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  name: stopPlacesGroup.current.name,
  description: stopPlacesGroup.current.description,
  members: stopPlacesGroup.current.members,
});

export default connect(mapStateToProps)(GroupOfStopPlacesDetails);
