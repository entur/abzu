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

import React, { Component } from "react";
import FlatButton from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import * as altNameConfig from "../../config/altNamesConfig";
import { getIn } from "../../utils/";
import MdClose from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

class EditAltName extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  }

  getInitialState(props) {
    if (props.data) {
      return {
        value: getIn(props.data, ["name", "value"], ""),
        type: getIn(props.data, ["nameType"], ""),
        lang: getIn(props.data, ["name", "lang"], ""),
      };
    } else {
      return {
        value: "",
        type: 0,
        lang: 0,
      };
    }
  }

  render() {
    const {
      translations,
      handleEditAltName,
      formatMessage,
      editingId,
      handleClose,
    } = this.props;

    const { value, lang, type } = this.state;

    return (
      <div
        style={{
          background: "rgba(33, 150, 243, 0)",
          border: "1px dotted",
          padding: 10,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9em",
                width: "100%",
              }}
            >
              {translations.editing}
            </div>
            <IconButton onClick={handleClose}>
              <MdClose />
            </IconButton>
          </div>
        </div>
        <Select
          fullWidth={true}
          label={translations.nameType}
          value={type}
          onChange={(event, key, type) => {
            this.setState({
              type,
            });
          }}
        >
          {altNameConfig.supportedNameTypes.map((type) => (
            <MenuItem key={"type-" + type} value={type}>
              {formatMessage({
                id: `altNamesDialog.nameTypes.${type}`,
              })}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth={true}
          label={translations.language}
          value={lang}
          onChange={(event, key, lang) => {
            this.setState({
              lang,
            });
          }}
        >
          {altNameConfig.languages.map((key) => (
            <MenuItem key={"lang-" + key} value={key}>
              {formatMessage({
                id: `altNamesDialog.languages.${key}`,
              })}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth={true}
          hintText={translations.value}
          value={value}
          onChange={(e, value) => {
            this.setState({
              value,
            });
          }}
        />
        <FlatButton
          style={{ marginTop: 10, width: "100%", textAlign: "center" }}
          disabled={!value}
          primary={true}
          onClick={() => {
            handleEditAltName(lang, value, type, editingId);
          }}
        >
          {translations.update}
        </FlatButton>
      </div>
    );
  }
}

export default EditAltName;
