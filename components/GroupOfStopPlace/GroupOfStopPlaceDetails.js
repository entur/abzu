import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import GroupOfStopPlacesList from './GroupOfStopPlacesList';
import {StopPlacesGroupActions} from '../../actions/';
import { connect } from 'react-redux';

class GroupOfStopPlaceDetails extends Component {

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

    const { name, description } = this.props;

    return (
      <div style={{padding: 5, minHeight: 400}}>
        <TextField
          floatingLabelText={"Name"}
          fullWidth={true}
          value={name}
          onChange={this.handleChangeName.bind(this)}
        />
        <TextField
          floatingLabelText={"Description"}
          fullWidth={true}
          value={description}
          onChange={this.handleChangeDescription.bind(this)}
        />
        <Divider/>
        <GroupOfStopPlacesList stopPlaces={this.props.members}/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  name: stopPlacesGroup.current.name,
  description: stopPlacesGroup.current.description,
  members: stopPlacesGroup.current.members,
});

export default connect(mapStateToProps)(GroupOfStopPlaceDetails);
