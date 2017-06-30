import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl } from 'react-intl';

class EditKeyValuePair extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      values: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      values: this.getValuesByKey(nextProps.keyValues, nextProps.editingKey)
    })
  }

  handleUpdate() {
    const { handleUpdateValues, editingKey } = this.props;
    const { values } = this.state;
    handleUpdateValues(editingKey, values.split('\n'))
  }

  getValuesByKey(keyValues, key) {
    for (let i = 0; i < keyValues.length; i++) {
      if (keyValues[i].key === key) {
        return keyValues[i].values.join('\r\n');
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
      <div style={{background: '#fff', border: '1px solid #777'}}>
        <div style={{marginLeft: 5, marginTop: 5}}>
            <span style={{fontSize: 12, fontWeight: 600}}>
              { `${formatMessage({id: 'editing_key'})} ${editingKey}`}
            </span>
            <TextField
              id="editing-key-values"
              onChange={ (e, v) => { this.setState({
                values: v
              })}}
              value={values}
              fullWidth={true}
              multiLine={true}
            />
        </div>
        <FlatButton
          style={{ marginTop: 10, width: '100%', textAlign: 'center' }}
          onClick={this.handleUpdate.bind(this)}
          primary={true}
        >
          {formatMessage({id: 'update'})}
        </FlatButton>
      </div>
      )
  }
}

export default injectIntl(EditKeyValuePair);