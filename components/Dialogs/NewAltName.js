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

import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import * as altNameConfig from '../../config/altNamesConfig';

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
      formatMessage
    } = this.props;

    return (
      <div
        style={{
          background: 'rgba(33, 150, 243, 0)',
          border: '1px dotted',
          padding: 10,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: '0.9em',
            width: '100%',
            marginTop: 10
          }}
        >
          {translations.addAltName}
        </div>
        <SelectField
          style={{ marginTop: -10 }}
          fullWidth={true}
          floatingLabelText={translations.nameType}
          value={type}
          onChange={handleTypeChange}
        >
          {altNameConfig.supportedNameTypes.map((type, index) =>
            <MenuItem
              key={'type-' + type}
              value={index}
              primaryText={formatMessage({ id: `altNamesDialog.nameTypes.${type}`})}
            />
          )}
        </SelectField>
        <SelectField
          style={{ marginTop: -10 }}
          fullWidth={true}
          floatingLabelText={translations.language}
          value={lang}
          onChange={onLanguageChange}
        >
          {altNameConfig.languages.map((key, index) =>
            <MenuItem
              key={'lang-' + index}
              value={index}
              primaryText={formatMessage({ id: `altNamesDialog.languages.${key}` })}
            />
          )}
        </SelectField>
        <TextField
          fullWidth={true}
          hintText={translations.value}
          value={value || ''}
          onChange={onValueChange}
        />
        <FlatButton
          style={{ marginTop: 10, width: '100%', textAlign: 'center' }}
          disabled={!value}
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
