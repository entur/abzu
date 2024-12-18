import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { Component } from "react";
import { connect } from "react-redux";
import { StopPlacesGroupActions } from "../../actions/";
import GroupOfStopPlacesList from "./GroupOfStopPlacesList";

class GroupOfStopPlacesDetails extends Component {
  handleChangeName(e, name) {
    this.props.dispatch(StopPlacesGroupActions.changeName(e.target.value));
  }

  handleChangeDescription(e, description) {
    this.props.dispatch(
      StopPlacesGroupActions.changeDescription(e.target.value),
    );
  }

  render() {
    const { name, description, formatMessage, canEdit } = this.props;

    return (
      <div style={{ padding: 5, minHeight: 400 }}>
        <TextField
          variant="standard"
          label={formatMessage({ id: "name" })}
          fullWidth={true}
          errorText={name ? "" : formatMessage({ id: "name_is_required" })}
          value={name}
          disabled={!canEdit}
          onChange={this.handleChangeName.bind(this)}
        />
        <TextField
          variant="standard"
          label={formatMessage({ id: "description" })}
          fullWidth={true}
          disabled={!canEdit}
          value={description}
          onChange={this.handleChangeDescription.bind(this)}
          style={{ marginTop: 10 }}
        />
        <Divider />
        <GroupOfStopPlacesList
          canEdit={canEdit}
          stopPlaces={this.props.members}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ stopPlacesGroup }) => ({
  name: stopPlacesGroup.current.name,
  description: stopPlacesGroup.current.description,
  members: stopPlacesGroup.current.members,
});

export default connect(mapStateToProps)(GroupOfStopPlacesDetails);
