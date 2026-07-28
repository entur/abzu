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
    } catch (error) {}
  }

  handleChangeName(e) {
    this.props.dispatch(StopPlacesGroupActions.changeName(e.target.value));
  }

  handleChangeDescription(e) {
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

  getPurposeOfGroupingLabel(option) {
    const { formatMessage } = this.props;
    const translationKey = `purpose_of_grouping_type_${option.name?.value}`;
    console.log("purpose of grouping: " + translationKey);
    try {
      const translated = formatMessage({ id: translationKey });
      console.log("purpose of grouping2: " + translated);
      // If translation exists and is not the key itself, use it
      if (translated && translated !== translationKey) {
        return translated;
      }
    } catch (error) {
      // Fall through to fallback
      console.log("purpose of grouping ERROR: " + translationKey);
    }

    // Fallback to API value or ID
    return option.name?.value || option.id;
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
                {this.getPurposeOfGroupingLabel(option)}
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
