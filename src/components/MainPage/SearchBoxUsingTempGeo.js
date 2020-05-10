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
import { FormattedMessage } from "react-intl";

class SearchBoxMissingGeo extends Component {
  render() {
    const {
      userSuppliedCoordinates,
      result,
      handleChangeCoordinates,
    } = this.props;

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
                borderBottom: "1px dotted",
                color: "rgb(0, 188, 212)",
                fontWeight: 600,
                marginBottom: 10,
                fontSize: "0.8em",
                cursor: "pointer",
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
