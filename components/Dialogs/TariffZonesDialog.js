import React from 'react';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

class TariffZonesDialog extends React.Component {
  render() {
    const { open, intl, tariffZones = [], handleClose } = this.props;
    const { formatMessage } = intl;

    const translations = {
      value: formatMessage({ id: 'name' }),
      tariffZones: formatMessage({ id: 'tariffZones' }),
      noTariffZones: formatMessage({ id: 'noTariffZones' }),
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
      marginRight: 5,
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
          {!tariffZones.length
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
                {tariffZones.map((tz, i) =>
                  <div
                    key={'tariffZone-' + i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 10,
                      justifyContent: 'space-between',
                      lineHeight: 2,
                    }}
                  >
                    <div style={itemStyle}>{tz.id}</div>
                    <div style={itemStyle}>{tz.name}</div>
                  </div>,
                )}
              </div>}
        </div>
      </div>
    );
  }
}

export default connect(null)(TariffZonesDialog);
