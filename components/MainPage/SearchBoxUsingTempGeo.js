import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class SearchBoxMissingGeo extends Component {
  render() {

    const { userSuppliedCoordinates, result, handleChangeCoordinates } = this.props;

    if (userSuppliedCoordinates && result.isMissingLocation) {
      return (
        <div style={{ marginTop: 10 }}>
          <FormattedMessage
            className="message_warning"
            id="you_are_using_temporary_coordinates"
          />
          <div style={{ marginTop: 5, marginBottom: 10 }}>
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
              id="change_coordinates"
            />
          </span>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default SearchBoxMissingGeo;
