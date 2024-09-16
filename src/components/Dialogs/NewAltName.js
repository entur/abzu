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

class NewAltName extends Component {
  render() {
    const {
      translations,
      handleAddAltName,
      handleTypeChange,
      onLanguageChange,
      onValueChange,
      lang,
      type,
      value,
      formatMessage,
      valid,
    } = this.props;

    return (
      <div
        style={{
          background: "rgba(33, 150, 243, 0)",
          border: "1px dotted",
          padding: 10,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.9em",
            width: "100%",
            marginTop: 10,
          }}
        >
          {translations.addAltName}
        </div>
        <Select
          style={{ marginTop: 10 }}
          fullWidth={true}
          label={translations.nameType}
          value={type}
          onChange={handleTypeChange}
          variant="standard"
        >
          {altNameConfig.supportedNameTypes.map((type, index) => (
            <MenuItem key={"type-" + type} value={type}>
              {formatMessage({
                id: `altNamesDialog.nameTypes.${type}`,
              })}
            </MenuItem>
          ))}
        </Select>
        <Select
          style={{ marginTop: 10 }}
          fullWidth={true}
          label={translations.language}
          value={lang}
          onChange={onLanguageChange}
          variant="standard"
        >
          {altNameConfig.languages.map((key, index) => (
            <MenuItem key={"lang-" + index} value={key}>
              {formatMessage({
                id: `altNamesDialog.languages.${key}`,
              })}
            </MenuItem>
          ))}
        </Select>
        <TextField
          style={{ marginTop: 10 }}
          fullWidth={true}
          hintText={translations.value}
          label={translations.value}
          onChange={onValueChange}
          value={value}
          variant="standard"
        />
        <FlatButton
          style={{ marginTop: 10, width: "100%", textAlign: "center" }}
          disabled={!valid}
          primary={true}
          onClick={() => {
            handleAddAltName();
          }}
        >
          {translations.add}
        </FlatButton>
      </div>
    );
  }
}

export default NewAltName;
