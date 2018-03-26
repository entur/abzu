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
import { getIn } from '../../utils/';
import MdClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

class EditAltName extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  }

  getInitialState(props) {
    if (props.data) {
      const type = altNameConfig.supportedNameTypes.findIndex( nameType => {
        return (props.data.nameType === nameType.value);
      });

      const langKey = getIn(props.data, ['name', 'lang'], '');

      const lang = Object.keys(altNameConfig.languages).findIndex( key => {
        return (key === langKey);
      });

      return({
        value: getIn(props.data, ['name', 'value'], ''),
        type,
        lang,
      });
    } else {
      return ({
        value: '',
        type: 0,
        lang: 0,
      });
    }
  }

  render() {
    const {
      translations,
      handleEditAltName,
      locale,
      editingId,
      handleClose
    } = this.props;

    const { value, lang, type } = this.state;

    return (
      <div
        style={{
          background: 'rgba(33, 150, 243, 0)',
          border: '1px dotted',
          padding: 10
        }}
      >
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{
              fontWeight: 600,
              fontSize: '0.9em',
              width: '100%',
            }}>{translations.editing}</div>
            <IconButton onClick={handleClose}>
              <MdClose/>
            </IconButton>
          </div>
        </div>
        <SelectField
          style={{ marginTop: -10 }}
          fullWidth={true}
          floatingLabelText={translations.nameType}
          value={type}
          onChange={(e, type) => {
            this.setState({
              type
            });
          }}
        >
          {altNameConfig.supportedNameTypes.map((type, index) =>
            <MenuItem
              key={'type-' + type.value}
              value={index}
              primaryText={type.name[locale]}
            />
          )}
        </SelectField>
        <SelectField
          style={{ marginTop: -10 }}
          fullWidth={true}
          floatingLabelText={translations.language}
          value={lang}
          onChange={(e, lang) => {
            this.setState({
              lang
            });
          }}
        >
          {Object.keys(altNameConfig.languages).map((key, index) =>
            <MenuItem
              key={'lang-' + index}
              value={index}
              primaryText={altNameConfig.languages[key][locale]}
            />
          )}
        </SelectField>
        <TextField
          fullWidth={true}
          hintText={translations.value}
          value={value}
          onChange={(e, value) => {
            this.setState({
              value
            });
          }}
        />
        <FlatButton
          style={{ marginTop: 10, width: '100%', textAlign: 'center' }}
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
