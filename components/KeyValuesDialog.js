import React from 'react';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

class KeyValuesDialog extends React.Component {
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
      top: 190,
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
            {' '}
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
            maxHeight: 400,
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
                {' '}{translations.noTariffZones}
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
                      lineHeight: 2,
                    }}
                  >
                    <div style={{...itemStyle, fontWeight: 600, flex: 1}}>{kvp.key}</div>
                    <div style={itemStyle}>
                      {kvp.values.map ( (v,i) => (
                        <p key={"value-"+i}>{v}</p>
                      ))}
                    </div>
                  </div>,
                )}
              </div>}
        </div>
      </div>
    );
  }
}

export default connect(null)(KeyValuesDialog);
