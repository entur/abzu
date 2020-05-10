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
import { isBrowserSupported } from "../utils/browserSupport";
import { injectIntl } from "react-intl";

class BrowserSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWarning: !isBrowserSupported(),
    };
  }

  handleClose() {
    this.setState({
      showWarning: false,
    });
  }

  render() {
    const { intl } = this.props;
    const { formatMessage } = intl;
    const { showWarning } = this.state;

    if (!showWarning) return null;

    const wrapperStyle = {
      position: "absolute",
      bottom: 0,
      height: 300,
      width: "100%",
      zIndex: 9999,
      background: "#fff",
      border: "1px solid black",
      padding: 20,
    };

    const innerDivStyle = {
      width: "95%",
      margin: "auto",
    };
    return (
      <div style={wrapperStyle}>
        <div style={innerDivStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>{formatMessage({ id: "browser_unsupported_title" })}</h1>
            <div
              onClick={this.handleClose.bind(this)}
              style={{ fontSize: "1.5em", marginRight: 20, cursor: "pointer" }}
            >
              X
            </div>
          </div>
          <p>{formatMessage({ id: "browser_explanation" })}</p>
          <p>{formatMessage({ id: "browser_recommendation" })}</p>
          <p>{formatMessage({ id: "browser_supported_browsers" })}</p>
          <ul style={{ listStyle: "none" }}>
            <li>Chrome</li>
            <li>Firefox</li>
            <li>Safari</li>
            <li>Microsoft Edge</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default injectIntl(BrowserSupport);
