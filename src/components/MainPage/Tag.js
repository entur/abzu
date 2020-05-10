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
import PropTypes from "prop-types";
import ToolTippable from "../EditStopPage/ToolTippable";
import { injectIntl } from "react-intl";

class Tag extends Component {
  render() {
    const { data, intl, textSize } = this.props;
    const { name, comment } = data;
    const { formatMessage } = intl;
    const noComment = formatMessage({ id: "comment_missing" });
    const tagComment = comment || noComment;

    if (!name) return null;

    const content = (
      <div
        style={{
          padding: 5,
          margin: "0 5px 5px 0",
          display: "inline-block",
          borderRadius: 3,
          height: 12,
          background: "orange",
          color: "#fff",
          width: "auto",
          cursor: "pointer",
          fontSize: textSize || "0.7em",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            lineHeight: textSize || "0.7em",
            margin: 5,
            verticalAlign: "middle",
          }}
        >
          {name}
        </div>
      </div>
    );

    return (
      <ToolTippable toolTipText={tagComment}>
        <span>{content}</span>
      </ToolTippable>
    );
  }
}

Tag.propTypes = {
  data: PropTypes.shape({
    created: PropTypes.string,
    name: PropTypes.string.isRequired,
    comment: PropTypes.string,
  }),
};

export default injectIntl(Tag);
