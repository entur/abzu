import React from 'react';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import MdEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconButton from 'material-ui/IconButton';
import { enturPrimary } from '../config/enturTheme';
import EditKeyValuePair from './EditKeyValuePair';
import { StopPlaceActions } from '../actions/';


class KeyValuesDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditingOpen: false,
      editingKey: null
    }
  }

  handleEditValuesForKey(key) {
    this.setState({
      isEditingOpen: true,
      editingKey: key
    })
  }

  handleUpdateValues(key, values) {
    this.setState({
      isEditingOpen: false
    })
    this.props.dispatch(StopPlaceActions.updateKeyValuesForKey(key, values));
  }

  render() {
    const { open, intl, keyValues = [], handleClose } = this.props;
    const { formatMessage } = intl;

    const translations = {
      value: formatMessage({ id: 'name' }),
      tariffZones: formatMessage({ id: 'key_values_hint' }),
      noTariffZones: formatMessage({ id: 'key_values_no' }),
    };

    if (!open) return null;

    const style = {
      position: 'fixed',
      left: 400,
      top: 105,
      background: '#fff',
      border: '1px solid black',
      width: 350,
      zIndex: 999,
    };

    const itemStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      flex: 2,
    };

    return (
      <div style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <div
            style={{
              marginTop: 8,
              fontWeight: 60,
              marginLeft: 10,
              fontWeight: 600,
            }}
          >
            {translations.tariffZones}
          </div>
          <IconButton
            style={{ marginRight: 5 }}
            onTouchTap={() => {
              handleClose();
            }}
          >
            <MdClose />
          </IconButton>
        </div>
        <div
          style={{
            width: '100%',
            fontSize: 14,
            maxHeight: 300,
            overflowY: 'scroll',
            marginLeft: 15,
            marginBottom: 5,
          }}
        >
          {!keyValues.length
            ? <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: 10,
                  fontSize: 12,
                }}
              >
                {translations.noTariffZones}
              </div>
            : <div
                style={{
                  width: '100%',
                  fontSize: 12,
                  overflowY: 'overlay',
                  maxHeight: 400,
                  marginLeft: 5,
                }}
              >
                {keyValues.map((kvp, i) =>
                  <div
                    key={'key-value-' + i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      lineHeight: 1.2,
                    }}
                  >
                    <div style={{...itemStyle, fontWeight: 600, flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>{kvp.key}</span>
                        <MdEdit
                          style={{height: 14, width: 14, color: enturPrimary, marginTop: -2, marginLeft: 5, cursor: 'pointer'}}
                          onClick={() => this.handleEditValuesForKey(kvp.key)}
                        />
                      </div>
                    </div>
                    <div style={itemStyle}>
                      {kvp.values.map ( (v,i) => (
                        <p key={"value-"+i}>{v}</p>
                      ))}
                    </div>
                  </div>,
                )}
              </div>}
        </div>
        <EditKeyValuePair
          isOpen={this.state.isEditingOpen}
          editingKey={this.state.editingKey}
          keyValues={keyValues}
          handleUpdateValues={this.handleUpdateValues.bind(this)}
        />
      </div>
    );
  }
}

export default connect(null)(KeyValuesDialog);
