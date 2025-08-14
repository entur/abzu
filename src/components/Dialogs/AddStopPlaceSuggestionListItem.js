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

import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { Component } from "react";
import { injectIntl } from "react-intl";
import HasExpiredInfo from "../MainPage/HasExpiredInfo";
import ModalityIconImg from "../MainPage/ModalityIconImg";

class AddStopPlaceSuggestionListItem extends Component {
  render() {
    const { suggestion, checked, onCheck, intl, disabled } = this.props;
    const { formatMessage } = intl;

    // Style for expired items to make them visually distinct
    const itemStyle = {
      display: "flex",
      alignItems: "center",
      padding: 4,
      opacity: suggestion.hasExpired ? 0.6 : 1, // Dim expired items
      transition: "opacity 0.3s",
    };

    return (
      <div style={itemStyle}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={suggestion && (suggestion.hasExpired || disabled)}
              checked={checked}
              onChange={(e, v) => onCheck(suggestion.id, v)}
            />
          }
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              {suggestion.isParent ? (
                <div style={{ marginRight: 5, fontWeight: 600 }}>MM</div>
              ) : (
                <ModalityIconImg
                  type={suggestion.stopPlaceType}
                  submode={suggestion.submode}
                  style={{ marginRight: 5 }}
                />
              )}
              <div
                style={{
                  fontSize: "0.9em",
                  flex: 0.8,
                  whiteSpace: "nowrap",
                  paddingRight: 10,
                }}
              >
                {suggestion.name ? (
                  <span>{suggestion.name}</span>
                ) : (
                  <span style={{ fontStyle: "italic", fontSize: "0.8em" }}>
                    {formatMessage({ id: "is_missing_name" })}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "0.9em",
                  flex: 1.5,
                  display: "flex",
                }}
              >
                <div style={{ flex: 3 }}>
                  <div>{suggestion.id}</div>
                </div>
                <HasExpiredInfo
                  show={suggestion.hasExpired}
                  formatMessage={formatMessage}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

AddStopPlaceSuggestionListItem.propTypes = {
  suggestion: PropTypes.object.isRequired,
};

export default injectIntl(AddStopPlaceSuggestionListItem);
