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

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import { injectIntl } from "react-intl";
import AccessibilityStopTab from "./AccessibilityAssessment/AccessibilityStopTab";
import FacilitiesStopTab from "./FacilitiesStopTab";

class EditStopAdditional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  handleTabOnChange = (event, value) => {
    this.setState({
      activeTabIndex: value,
    });
  };

  render() {
    const { intl, disabled } = this.props;
    const { formatMessage } = intl;

    const style = {
      background: "#fff",
    };

    const tabStyle = {
      color: "#000",
      fontSize: "0.7em",
      fontWeight: 600,
    };

    const { activeTabIndex } = this.state;

    return (
      <div style={style} id="additional">
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{ backgroundColor: "#fff", marginTop: -5 }}
        >
          <Tab
            style={tabStyle}
            label={formatMessage({ id: "accessibility" })}
            value={0}
          ></Tab>
          <Tab
            style={tabStyle}
            label={formatMessage({ id: "facilities" })}
            value={1}
          ></Tab>
        </Tabs>
        {activeTabIndex === 0 && (
          <AccessibilityStopTab intl={intl} disabled={disabled} />
        )}
        {activeTabIndex === 1 && (
          <FacilitiesStopTab intl={intl} disabled={disabled} />
        )}
      </div>
    );
  }
}

export default injectIntl(EditStopAdditional);
