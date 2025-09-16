import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Component } from "react";
import { connect } from "react-redux";
import { StopPlacesGroupActions } from "../../actions/";
import { getPurposeOfGroupingQuery } from "../../graphql/Tiamat/queries";
import { getTiamatClient } from "../../graphql/clients";
import GroupOfStopPlacesList from "./GroupOfStopPlacesList";

class GroupOfStopPlacesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purposeOfGroupingOptions: [],
    };
  }

  componentDidMount() {
    this.fetchPurposeOfGroupingOptions();
  }

  async fetchPurposeOfGroupingOptions() {
    try {
      const client = getTiamatClient();
      const result = await client.query({
        query: getPurposeOfGroupingQuery,
      });

      if (result.data && result.data.purposeOfGrouping) {
        this.setState({
          purposeOfGroupingOptions: result.data.purposeOfGrouping,
        });
      }
    } catch (error) {
      console.error("Failed to fetch purpose of grouping options:", error);
    }
  }

  handleChangeName(e, name) {
    this.props.dispatch(StopPlacesGroupActions.changeName(e.target.value));
  }

  handleChangeDescription(e, description) {
    this.props.dispatch(
      StopPlacesGroupActions.changeDescription(e.target.value),
    );
  }

  handleChangePurposeOfGrouping(e) {
    const selectedOption = this.state.purposeOfGroupingOptions.find(
      (option) => option.id === e.target.value,
    );
    this.props.dispatch(
      StopPlacesGroupActions.changePurposeOfGrouping(selectedOption || null),
    );
  }

  render() {
    const { name, description, purposeOfGrouping, formatMessage, canEdit } =
      this.props;
    const { purposeOfGroupingOptions } = this.state;

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
        <FormControl
          variant="standard"
          fullWidth={true}
          style={{ marginTop: 10 }}
          disabled={!canEdit}
          error={!purposeOfGrouping}
        >
          <InputLabel required>
            {formatMessage({ id: "purpose_of_grouping" })}
          </InputLabel>
          <Select
            value={purposeOfGrouping?.id || ""}
            onChange={this.handleChangePurposeOfGrouping.bind(this)}
          >
            {purposeOfGroupingOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name?.value || option.id}
              </MenuItem>
            ))}
          </Select>
          {!purposeOfGrouping && (
            <div
              style={{ color: "#f44336", fontSize: "0.75rem", marginTop: 3 }}
            >
              {formatMessage({ id: "purpose_of_grouping_is_required" })}
            </div>
          )}
        </FormControl>
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
  purposeOfGrouping: stopPlacesGroup.current.purposeOfGrouping,
});

export default connect(mapStateToProps)(GroupOfStopPlacesDetails);
