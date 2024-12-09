import React from "react";
import TextField from "@mui/material/TextField";
import FlatButton from "@mui/material/Button";
import { injectIntl } from "react-intl";

class EditKeyValuePair extends React.Component {
  constructor(props) {
    super(props);
    const { keyValues, editingKey } = props;

    this.state = {
      values: this.getValuesByKey(keyValues, editingKey) || "", // Initialize with existing values
    };
  }

  componentDidUpdate(prevProps) {
    const { keyValues, editingKey } = this.props;

    // Update the state if editingKey or keyValues have changed
    if (
      prevProps.editingKey !== editingKey ||
      prevProps.keyValues !== keyValues
    ) {
      const updatedValues = this.getValuesByKey(keyValues, editingKey) || "";
      this.setState({ values: updatedValues });
    }
  }

  handleUpdate() {
    const { handleUpdateValues, editingKey } = this.props;
    const { values } = this.state;
    handleUpdateValues(editingKey, values.split("\n"));
  }

  getValuesByKey(keyValues, key) {
    if (!keyValues || !Array.isArray(keyValues)) return ""; // Safeguard for undefined or invalid keyValues

    for (let i = 0; i < keyValues.length; i++) {
      if (keyValues[i].key === key) {
        return keyValues[i].values.join("\r\n");
      }
    }
    return ""; // Return empty string if key not found
  }

  render() {
    const { editingKey, isOpen, intl } = this.props;
    const { formatMessage } = intl;
    const { values } = this.state;

    if (!isOpen) return null;

    return (
      <div style={{ background: "#fff", border: "1px solid #777" }}>
        <div style={{ marginLeft: 5, marginTop: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {`${formatMessage({ id: "editing_key" })} ${editingKey}`}
          </span>
          <TextField
            variant={"standard"}
            id="editing-key-values"
            onChange={(event) => {
              this.setState({
                values: event.target.value,
              });
            }}
            multiline
            value={values}
            fullWidth={true}
          />
        </div>
        <FlatButton
          style={{ marginTop: 10, width: "100%", textAlign: "center" }}
          onClick={this.handleUpdate.bind(this)}
          primary={true}
        >
          {formatMessage({ id: "update" })}
        </FlatButton>
      </div>
    );
  }
}

export default injectIntl(EditKeyValuePair);
