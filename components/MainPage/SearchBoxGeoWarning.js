import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Warning from 'material-ui/svg-icons/alert/warning';


class SearchBoxGeoWarning extends Component {
  render() {
    const { userSuppliedCoordinates, result, handleChangeCoordinates } = this.props;

    if (!userSuppliedCoordinates && result.isMissingLocation) {
      return (
        <div className="warning_message" style={{ marginTop: 10 }}>
          <Warning style={{ verticalAlign: 'sub', fill: 'rgb(214, 134, 4)' }} />
          <FormattedMessage
            className="message_warning"
            id="is_missing_coordinates"
          />
          <div style={{ marginTop: 2, marginBottom: 10 }}>
            <span
              style={{
                borderBottom: '1px dotted',
                color: 'rgb(0, 188, 212)',
                fontWeight: 600,
                marginBottom: 10,
                fontSize: '0.8em',
                cursor: 'pointer'
              }}
              onClick={() => handleChangeCoordinates()}
            >
              <FormattedMessage
                className="message_warning_helper_text"
                id="is_missing_coordinates_help_text"
              />
            </span>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default SearchBoxGeoWarning;
