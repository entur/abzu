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

import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl } from 'react-intl';

class CreateKeyValuePair extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialValues();
  }

  getInitialValues = () => ({
    values: '',
    key: '',
    errorMsg: ''
  })

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState(this.getInitialValues);
    }
  }

  handleUpdate() {
    const { handleCreateValues, keyValues, intl } = this.props;
    const { key, values } = this.state;

    let keyAlreadyExists = keyValues.some(kv => kv.key.toLowerCase() === key.toLowerCase());

    if (keyAlreadyExists) {
      this.setState({
        errorMsg: `${intl.formatMessage({id: 'key_already_exists'})}: ${key}`
      })
    } else if (!key) {
      this.setState({
        errorMsg: `${intl.formatMessage({id: 'key_cannot_be_empty'})}`
      });
    } else {
      handleCreateValues(key, values.split('\n'));
      this.setState(this.getInitialValues);
    }
  }

  render() {

    const { isOpen, intl } = this.props;
    const { formatMessage } = intl;
    const { values, key, errorMsg } = this.state;

    if (!isOpen) return null;

    return (
      <div style={{background: '#fff', border: '1px solid #777'}}>
        <div style={{marginLeft: 5, marginTop: 5}}>
            <span style={{fontSize: 12, fontWeight: 600}}>
              { formatMessage({id: 'creating_new_key_values'}) }
            </span>
          <TextField
            id="new-key"
            onChange={ (e, v) => { this.setState({
              key: v
            })}}
            value={key}
            hintText="Key"
            floatingLabelText="Key"
            floatingLabelFixed={true}
            fullWidth={true}
          />
          <TextField
            id="new-values"
            onChange={ (e, v) => { this.setState({
              values: v
            })}}
            hintText="Values"
            floatingLabelText="Values"
            floatingLabelFixed={true}
            value={values}
            fullWidth={true}
            multiLine={true}
          />
        </div>
        <div style={{color: 'red', fontSize: 11, textAlign: 'right', marginRight: 20}}>
          {errorMsg}
        </div>
        <FlatButton
          style={{ marginTop: 10, width: '100%', textAlign: 'center' }}
          onClick={this.handleUpdate.bind(this)}
          primary={true}
        >
          {formatMessage({id: 'create'})}
        </FlatButton>
      </div>
    )
  }
}

export default injectIntl(CreateKeyValuePair);
