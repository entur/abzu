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

import React from "react";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { injectIntl } from "react-intl";

class EditKeyValuePair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      values: this.getValuesByKey(nextProps.keyValues, nextProps.editingKey),
    });
  }

  handleUpdate() {
    const { handleUpdateValues, editingKey } = this.props;
    const { values } = this.state;
    handleUpdateValues(editingKey, values.split("\n"));
  }

  getValuesByKey(keyValues, key) {
    for (let i = 0; i < keyValues.length; i++) {
      if (keyValues[i].key === key) {
        return keyValues[i].values.join("\r\n");
      }
    }
    return [];
  }

  render() {
    const { editingKey, isOpen, intl } = this.props;
    const { formatMessage } = intl;
    const { values = "" } = this.state;

    if (!isOpen) return null;

    return (
      <div style={{ background: "#fff", border: "1px solid #777" }}>
        <div style={{ marginLeft: 5, marginTop: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {`${formatMessage({ id: "editing_key" })} ${editingKey}`}
          </span>
          <TextField
            id="editing-key-values"
            onChange={(e, v) => {
              this.setState({
                values: v,
              });
            }}
            value={values}
            fullWidth={true}
            multiLine={true}
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
